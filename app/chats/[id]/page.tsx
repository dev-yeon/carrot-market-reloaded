
import ChatMessagesList from "@/components/chat-messages-list";
import ErrorPage from "@/components/error-page";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { InferGetServerSidePropsType } from "next";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import { getServerSideProps } from "next/dist/build/templates/pages";
import { notFound } from "next/navigation";
import { markMessageAsRead, markProductAsSold } from "@/app/chats/[id]/actions";
import React from 'react'

// 채팅방 정보를 가져오는 함수
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
  const session = await getSession();

  // 채팅방이 존재하고, 현재 사용자가 채팅방의 사용자 목록에 없으면 null 반환
  if (room && session?.id && !room.users.some((user) => user.id === session.id)) {
    return null;
  }

  return room;
}

//체팅방 메세지를 전부 가져오는 함수 
async function getMessages(chatRoomId : string) {
  return await db.message.findMany({
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
    },
  });
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
export default async function ChatRoom({
  params,
 }: { 
  params: Promise<{ id?: string }>; 
 })  {
  const resolvedParams = await params; // 비동기적으로 params 처리
  const chatRoomId = resolvedParams?.id;
  if (!chatRoomId) {
    return (
      <ErrorPage
        title="잘못된 접근"
        message="유효한 채팅방 ID가 없습니다."
      />
    );
  }
    // 비동기 작업 병렬 실행
    const [initialMessages, session, room] = await Promise.all([
      getMessages(chatRoomId),
      getSession(),
      getRoom(chatRoomId), // room객체 가져오기
    ]);
  if (!session?.id) {
    return (
      <ErrorPage
        title="세션 오류"
        message="로그인이 필요합니다."
      />
    );
  }
  if (!room) {
    return (
      <ErrorPage
        title="채팅방을 찾을 수 없습니다."
        message="존재하지 않거나 접근 권한이 없는 채팅방입니다."
      />
    );
  }
  // const initialMessages = await getMessages(params.id);
  
  // const userProfile = await getUserProfile(userId);
  // if(!userProfile){
  //   return notFound();
  // }
  // 채팅방 id, 사용자 id, 초기 메세지를 전달
  //메세지 읽음 처리 함수 
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
  // 마지막 메세지 읽음 상태 업데이트
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
  const buyer = users.find((user) => user.id !== session.id) || {
    id: 0,
    username: "알 수 없는 사용자",
  };
  return (
  <ChatMessagesList 
    chatRoomId = {chatRoomId} 
    userId={session?.id!} 
    buyerId={buyer.id
      // users
      //   ?.filter((user) => user.id !== session.id)
      //   ?.at(0)?.id ?? 0
    }
    username ={user.username|| "사용자"}
    avatar ={user.avatar || ""}
    initialMessages={initialMessages} 
    readMessage={markMessageAsRead}
    product={room.product}
    onSold={onSold}
  />
  );
} 

// export default ChatRoom;