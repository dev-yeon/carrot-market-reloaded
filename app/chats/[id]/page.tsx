import ChatMessagesList from "@/components/chat-messages-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { Prisma } from "@prisma/client";
import { notFound } from "next/navigation";

async function getRoom(id: string) {
  const room = await db.chatRoom.findUnique({
    where: { id },
    include: {
      users: { select: { id: true } },
      product: true,
    },
  });
  if (room) {
    const session = await getSession();
    const canSee = Boolean(room.users.find((user) => user.id === session?.id!));
    if (!canSee) return null;
  }
  return room;
}

async function getMessages(chatRoomId: string) {
  return db.message.findMany({
    where: { chatRoomId },
    select: {
      id: true,
      payload: true,
      created_at: true,
      userId: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
}

async function getUserProfile() {
  const session = await getSession();
  return db.user.findUnique({
    where: { id: session?.id! },
    select: {
      avatar: true,
      username: true,
    },
  });
}

interface ChatRoomProps {
  params: { id: string };
}
export default async function ChatRoom({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // Promise 처리
  const room = await getRoom(resolvedParams.id);
  if (!room) return notFound();

  const initialMessages = await getMessages(resolvedParams.id);
  const session = await getSession();
  const userProfile = await getUserProfile();
  if (!userProfile) return notFound();

  return (
    <ChatMessagesList
      chatRoomId={resolvedParams.id}
      userId={session?.id!}
      username={userProfile.username}
      avatar={userProfile.avatar!}
      productId={room.product.id}
      initialMessages={initialMessages}
    />
  );
}