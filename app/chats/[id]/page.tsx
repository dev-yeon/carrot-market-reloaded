import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";
import React from 'react'

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: {
      id,
    },
    include: {
      users: {
        select: { id: true },
      },
      product: true,
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session.id!));
    // 채팅방에 있는 사람이 현재 로그인한 사람인지 확인 
    if (!canSee) {
      return null;
    }
  }
  console.log('상품 id:',room?.product.id)
  console.log('채팅방 id:',room?.id)
  return room;
}

//체팅방 메세지를 전부 가져오는 함수 
async function getMessages(chatRoomId : string) {
  const messages = await db.message.findMany({
    where : {
      chatRoomId,
    } ,
    select : {
      id: true, // 메세지 아이디 
      payload : true, // 메세지 내용 
      created_at : true, // 메세지 생성 시간 
      userId : true, // 메세지 보낸 사람 아이디 
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
async function getUserProfile( ) {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
       id: session?.id! 
      },
      select: {
        avatar: true,
        username: true,
      },
  });
  return user;
}
export type InitialMessages = Prisma.PromiseReturnType<typeof getMessages>; 

export default async function ChatRoom({ params }: { params: { id: string } }) {
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }
 
  const initialMessages = await getMessages(params.id);
  const session = await getSession();
  const userProfile = await getUserProfile();
  if(!userProfile){
    return notFound();
  }
  // 채팅방 id, 사용자 id, 초기 메세지를 전달
  return (
  <ChatMessagesList 
    chatRoomId = {params.id} 
    userId={session?.id!} 
    username ={userProfile.username}
    avatar ={userProfile.avatar!}
    productId={room.product.id}
    // productId = {room.product.id}
    initialMessages={initialMessages} 
    
  />
  );
} 