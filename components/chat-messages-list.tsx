// 최상단에 추가
"use client";

import { InitialMessages } from "@/app/chats/[id]/page"
import { formatToTimeAgo } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react"

interface ChatMessagesListProps {
  initialMessages : InitialMessages
  userId : number
}
// 우리가 메세지를 보낸 사용자의 id가 있는지 확인하고, 있으면 메세지를 보낸 사용자의 이미지를 보여주고, 없으면 상대방의 이미지를 보여준다.
// severside 컴포넌트 : 내 메세지 
// client side 컴포넌트 : 상대방 메세지
export default function ChatMessagesList({initialMessages, userId} : ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  return (
  <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
    {messages.map(message => (
      <div key={message.id} className= {`flex gap-2 items-start ${message.userId === userId ? "justify-end" : ""}`} >
        { message.userId === userId ? null: (
             <Image src = {message.user.avatar!} alt = {message.user.username}  
        width={50} height={50} className="rounded-full size-8" />) }
 
        <div className={`flex flex-col gap-1 ${message.userId === userId ? "items-end" : ""}`}>
          <span className = {`${message.userId === userId ? "bg-neutral-500" : "bg-orange-500"} text-white p-2.5 rounded-md`}>
            {message.payload}
          </span>
          <span className="text-xs">
            {formatToTimeAgo(message.created_at.toString())}
            </span>
        </div>
      </div>
    ))}
  </div>
  ) 
}