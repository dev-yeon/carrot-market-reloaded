"use client";

import { markProductAsSold, markMessageAsRead } from "@/app/chats/[id]/actions";
import { useState } from "react";

interface ChatMessagesListProps {
  chatRoomId: string;
  userId: number;
  buyerId: number;
  username: string;
  avatar: string;
  initialMessages: any[];
  product: {
    id: number;
    title: string;
    isSold: boolean;
    userId: number;
  };
}

export default function ChatMessagesList({
  chatRoomId,
  userId,
  buyerId,
  username,
  avatar,
  initialMessages,
  product,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [isSold, setIsSold] = useState(product.isSold);

  const handleMarkAsSold = async () => {
    try {
      await markProductAsSold(product.id, userId, buyerId);
      setIsSold(true);
      alert("상품이 판매 완료 처리되었습니다.");
    } catch (error) {
      console.error("판매 완료 처리 중 오류:", error);
    }
  };

  const handleReadMessage = async (messageId: number) => {
    try {
      await markMessageAsRead(messageId);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error("메시지 읽음 처리 중 오류:", error);
    }
  };

  return (
    <div>
      <h1 className="text-xl">{product.title}</h1>
      {isSold ? (
        <span className="text-green-500">판매 완료</span>
      ) : (
        <button onClick={handleMarkAsSold} className="bg-orange-500 px-4 py-2 rounded">
          판매 완료
        </button>
      )}
      <ul>
        {messages.map((message) => (
          <li key={message.id} className="flex gap-2">
            <span>{message.payload}</span>
            {!message.isRead && message.userId !== userId && (
              <button onClick={() => handleReadMessage(message.id)}>읽음 처리</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}