import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { InferGetServerSidePropsType } from "next";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { notFound } from "next/navigation";
import React from 'react'

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: {
          id: true,
        },
      },
      product: {
        select: {
          id: true,
          title: true,
          isSold: true,
          userId: true,
        },
      },
    },
  });
  if (room) {
    const session = await getSession();
    // const userId = session?.user?.id
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    // 채팅방에 있는 사람이 현재 로그인한 사람인지 확인 
    if (!canSee) {
      return null;
    }
  }
  console.log('채팅방 id:',room?.id)
  return room;
}

//체팅방 메세지를 전부 가져오는 함수 
async function getMessages(chatRoomId : string) {
  const messages = await db.message.findMany({
    where : {
      chatRoomId,
    },
    select : {
      id: true, // 메세지 아이디 
      payload : true, // 메세지 내용 
      created_at : true, // 메세지 생성 시간 
      userId : true, // 메세지 보낸 사람 아이디 
      isRead: true,
      user : {
        select : {
          avatar : true, // 메세지 보낸 사람 아바타 
          username : true, // 메세지 보낸 사람 이름 
        }
      }
    }
  })
  
  return messages;
}

// 유저의 프로필을 전달하는 함수
async function getUserProfile(userId: number) {
  // const session = await getSession();
  const user = await db.user.findUnique({
    where: {
       id: userId
      },
      select: {
        id: true,
        avatar: true,
        username: true,
      },
  });
  return user;
}
// 유저의 캐시를 조회해 프로필을 전달하는 함수 
function getCachedUserProfile(userId: number) {
  const cachedOperation = nextCache(
    getUserProfile,
    [`user-profile-${userId}`],
    { tags: [`user-profile-${userId}`] }
  );
  return cachedOperation(userId);
}

export type InitialMessages = Prisma.PromiseReturnType<typeof getMessages>; 

// export default async function ChatRoom({
//   params,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
// // export default async function ChatRoom({ params }: { params: { id: string } }) {
//   if (!params?.id) {
//     console.error("params.id가 존재하지 않습니다.");
//     throw new Error("채팅방 ID가 유효하지 않습니다.");
//   }
//   const room = await getRoom(params.id);
//   if (!room) {
//     return notFound();
//   }
const ChatRoom = async ({ params }: { params: { id: string } }) => {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
 
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  // const userProfile = await getUserProfile(userId);
  // if(!userProfile){
  //   return notFound();
  // }
  // 채팅방 id, 사용자 id, 초기 메세지를 전달

  if (!session?.id) {
    throw new Error("유효하지 않은 세션입니다.");
  }
  const readMessage = async(messageId: number) => {
    "use server";
    await db.message.update({
      where: {
        id: messageId,
      },
      data : {
        isRead: true,
      },
    });
    revalidateTag(`chat-list`);
  };
  if (
    initialMessages.length > 0 && 
    initialMessages[initialMessages.length -1].userId !== session.id! && 
    !initialMessages[initialMessages.length -1].isRead
  ) {
    readMessage(initialMessages[initialMessages.length -1].id);
  }
  const user = await getCachedUserProfile(session.id!);
  if(!user) {
    return notFound();
  }
  const onSold = async ()=> {
    "use server"; 
    await db.product.update({
      where :{
        id: room.productId,
      },
      data: {
        isSold: true,
      },
      select : {
        id: true,
      },
    });
    const users = room.users;
    revalidateTag(
      `user-profile-${users.filter((user)=> user.id !== session.id)[0]}`
    );
    revalidateTag(`user-profile-${session.id}`);
    revalidateTag("chat-list")
  }; 
  const users = room.users;
  return (
  <ChatMessagesList 
    chatRoomId = {params.id} 
    userId={session?.id!} 
    buyerId={
      users
        ?.filter((user) => user.id !== session.id)
        ?.at(0)?.id ?? 0
    }
    username ={user.username}
    avatar ={user.avatar ?? ""}
    initialMessages={initialMessages} 
    readMessage={readMessage}
    product={room.product}
    onSold={onSold}
  />
  );
} 

export default ChatRoom;