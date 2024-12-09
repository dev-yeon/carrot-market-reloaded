// import ChatMessagesList from "@/components/chat-messages-list";
// import db from "@/lib/db";
// import getSession from "@/lib/session";
// import { Prisma } from "@prisma/client";
// import { notFound } from "next/navigation";
// import { unstable_cache as nextCache, revalidateTag } from "next/cache";

// async function getRoom(id: string) {
//   const room = await db.chatRoom.findUnique({
//     where: {
//       id,
//     },
//     include: {
//       users: {
//         select: {
//           id: true,
//         },
//       },
//       product: {
//         select: {
//           id: true,
//           title: true,
//           isSold:true,
//           userId: true,
//         },
//       },
//     },
//   });
//   if (room) {
//     const session = await getSession();
//     const canSee = Boolean(room.users.find((user) => user.id === session.id));
//     if (!canSee) return null;
//   }
//   return room;
// }

// async function getMessages(chatRoomId: string) {
//   const messages = await db.message.findMany({
//     where: {
//       chatRoomId,
//     },
//     select: {
//       id: true,
//       payload: true,
//       created_at: true,
//       userId: true,
//       isRead: true,
//       user: {
//         select: {
//           avatar: true,
//           username: true,
//         },
//       },
//     },
//   });
//   return messages;
// }

// async function getUserProfile(userId: number) {
//   const user = await db.user.findUnique({
//     where: {
//       id: userId,
//     },
//     select: {
//       id: true,
//       username: true,
//       avatar: true,
//     },
//   });
//   return user;
// }

// function getCachedUserProfile(userId: number) {
//   const cachedOperation = nextCache(
//     getUserProfile,
//     [`user-profile-${userId}`],
//     { tags: [`user-profile-${userId}`] }
//   );
//   return cachedOperation(userId);
// }

// export type InitialChatMessages = Prisma.PromiseReturnType<typeof getMessages>;

// const ChatRoom = async ({ params }: { params: { id: string } }) => {
//   const room = await getRoom(params.id);
//   if (!room) {
//     return notFound();
//   }
//   const initialMessages = await getMessages(params.id);
//   const session = await getSession();
//   const readMessage = async (messageId: number) => {
//     "use server";
//     await db.message.update({
//       where: {
//         id: messageId,
//       },
//       data: {
//         isRead: true,
//       },
//     });
//     revalidateTag(`chat-list`);
//   };
//   if (
//     initialMessages.length > 0 &&
//     initialMessages[initialMessages.length - 1].userId !== session.id! &&
//     !initialMessages[initialMessages.length - 1].isRead
//   ) {
//     readMessage(initialMessages[initialMessages.length - 1].id);
//   }
//   const user = await getCachedUserProfile(session.id!);
//   if (!user) {
//     return notFound();
//   }
//   const onSold = async () => {
//     "use server";
//     await db.product.update({
//       where: {
//         id: room.productId,
//       },
//       data: {
//         isSold: true,
//       },
//       select: {
//         id: true,
//       },
//     });
//     const users = room.users;
//     revalidateTag(
//       `user-profile-${users.filter((user) => user.id !== session.id)[0]}`
//     );
//     revalidateTag(`user-profile-${session.id}`);
//     revalidateTag("chat-list");
//   };
//   const users = room.users;
//   return (
//     <ChatMessagesList
//       chatRoomId={params.id}
//       userId={session.id!}
//       buyerId={users.filter((user) => user.id !== session.id)[0].id}
//       username={user.username}
//       avatar={user.avatar ?? ""}
//       initialMessages={initialMessages}
//       readMessage={readMessage}
//       product={room.product}
//       onSold={onSold}
//     />
//   );
// };

// export default ChatRoom;
import ChatRoom from "@/app/chats/[id]/page";
import { getChatRooms } from "./action";
import { Key } from "react";
import Image from "next/image";
import Link from "next/link";

export default async function Chats() {
    const chatRooms = await getChatRooms();
    return (
        
        <div className="p-5">
            <div className="flex flex-col gap-5">
                <h1 className="text-white text-4xl">내 채팅방</h1>
                <div className="flex gap-2 flex-wrap w-30">
                {chatRooms.map((room) => (
                       <Link 
                       href={`/chats/${room.id}`} 
                       key={room.id}
                   >
<div
  key={room.id}
  className="bg-neutral-600 p-4 rounded-lg hover:bg-neutral-700 transition flex flex-row gap-4 items-center h-32 w-full max-w-md"
>
                <Image src={room.users[0].avatar!} alt={room.users[0].username} width={50} height={50} className="rounded-full size-20" />
                    <div className="flex flex-col gap-2">
                    <h2 className="text-white text-xl line-clamp-1">{room.product.title}</h2>
<h2 className="line-clamp-1">
  {room.messages && room.messages.length > 0
    ? room.messages[room.messages.length - 1].payload
    : "메시지가 없습니다."}
</h2>
                        </div>
                        <div className="flex flex-col gap-2">
                  {/* 참여자 정보 */}
                  <p className="text-gray-500 text-xs">
                    참여자:{" "}
                    {room.users.map((user, index) => (
                      <span key={user.id}>
                        {user.username}
                        {index !== room.users.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                        <p className="text-gray-400 flex-wrap max-w-xs truncate">
  {room.users.map((user, index) => (
    <span key={user.id}>
      {user.username}
      {index !== room.users.length - 1 ? ", " : ""}
    </span>
  ))}
</p>
                        </div>
                    </div>
                    </Link>
                ))}   
               
                </div>
            </div>
        </div>
    );
}
