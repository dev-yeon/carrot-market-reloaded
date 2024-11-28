// 최상단에 추가
"use client";

import { InitialMessages } from "@/app/chats/[id]/page"
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import { useEffect, useRef, useState } from "react"

const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLIC_KEY;

interface ChatMessagesListProps {
  initialMessages : InitialMessages; // 초기 메세지
  userId : number; // 사용자 id
  chatRoomId : string; // 채팅방 id
}
// 우리가 메세지를 보낸 사용자의 id가 있는지 확인하고, 있으면 메세지를 보낸 사용자의 이미지를 보여주고, 없으면 상대방의 이미지를 보여준다.
// severside 컴포넌트 : 내 메세지 
// client side 컴포넌트 : 상대방 메세지
export default function ChatMessagesList({initialMessages, userId, chatRoomId} : ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages); // 초기 메세지 상태 설정
  const [message, setMessage] = useState(""); // 메세지 상태 설정
  const channel = useRef<RealtimeChannel>(); // 리랜더링 하지않고 저장할수 있음 (여러 함수간에 )
  const onChange = (event : React.ChangeEvent<HTMLInputElement>) => {
    const {
      // 이벤트 객체에서 대상의 값을 가져와서 메세지 상태를 업데이트
      target : {value}, 
    } = event;
    setMessage(value);
  };
  const onSubmit = (event : React.FormEvent) => {
    event.preventDefault(); // 폼 제출 방지하는 이유: 폼 제출 시 페이지가 리로드되기 때문
    // alert(message);
    setMessages(prevMessages => [...prevMessages, 
      {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
       user: { username: "string",
               avatar: "xxxx"
       },
    },
  ]);
  channel.current?.send({type: "broadcast", event: "message", payload: {message}});
    setMessage(""); // 메세지 상태 초기화
  };
  useEffect(()=> {
    // 클라이언트 생성
    const client = createClient(process.env.SUPABASE_URL!, SUPABASE_PUBLIC_KEY!);
    // 채팅 채널 생성
    channel.current = client.channel(`room-${chatRoomId}`);
    // 메세지 이벤트 수식어
    channel.current.on('broadcast', {event: 'message'}, (payload) =>{
      console.log(payload);
    })
    .subscribe();
    return () => {
      //유저가 이 페이지를 떠나면 unsubscribe
      channel.current?.unsubscribe(); 
    }
  }, []); 
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
          <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
  </div>
  ) 
}