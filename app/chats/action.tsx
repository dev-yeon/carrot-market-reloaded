"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function saveMessage(payload: string, chatRoomId: string) {
  const currentSession = await getSession();
  const session = await getSession();  //세션 (사용자 정보)가져오기
  const message = await db.message.create({
    data: {
      payload, // 메세지 내용
      chatRoomId, // 채팅방 id
      userId: session?.id!, // 사용자 id
    },
    select :{
      id: true
    }
  });
  revalidateTag("chat-list");
}

//기존 채팅방 찾기 
async function findExistingChatRoom(productId: string, userId: string) {
  return await db.chatRoom.findFirst({
    where: {
      AND: [
        { users: { some: { id: parseInt(userId, 10) } } }, // 사용자 조건
        { product: { id: parseInt(productId, 10) } }, // 관계를 통해 Product.id로 필터링
      ],
      
    },
  });
  
}