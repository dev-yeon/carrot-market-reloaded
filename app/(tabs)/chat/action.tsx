"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

export async function getChatRooms() {
  const session = await getSession();
  const chatRooms = await db.chatRoom.findMany({
    where: {
      users: { some: { id: session?.id } }, // 사용자가 참여한 채팅방 찾기
    },
    include: {
      messages: true, // 채팅방 메세지 정보 포함
      users: true, // 채팅방 참여자 정보 포함
      product: true, // 채팅방 상품 정보 포함
    },
    orderBy: {
      updated_at: "desc", // 채팅방 업데이트 시간 내림차순 정렬
    },
  });
  return chatRooms;
}

// "use server";

// import db from "@/lib/db";
// import getSession from "@/lib/session";
// import { revalidateTag } from "next/cache";

// export async function saveMessage(payload: string, chatRoomId: string) {
//   const session = await getSession();
//   await db.message.create({
//     data: {
//       payload,
//       chatRoomId,
//       userId: session.id!,
//     },
//     select: {
//       id: true,
//     },
//   });
//   revalidateTag("chat-list");
// }