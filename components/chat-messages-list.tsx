// 최상단에 추가
"use client";

import { InitialMessages } from "@/app/chats/[id]/page"
import { saveMessage } from "@/app/chats/action";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon, ChevronLeftIcon, UserIcon } from "@heroicons/react/24/solid";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react"

const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLIC_KEY;

interface ChatMessagesListProps {
  initialMessages : InitialMessages; // 초기 메세지
  userId : number; // 사용자 id
  buyerId: number;
  chatRoomId : string; // 채팅방 id
  username : string; // 사용자 이름
  avatar : string; // 사용자 아바타
  product :{
    id:number;
    title: string;
    isSold: boolean;
    userId: number;
  }
  onSold: () => void;
  readMessage: (messageId: number) => void;
}
// 우리가 메세지를 보낸 사용자의 id가 있는지 확인하고, 있으면 메세지를 보낸 사용자의 이미지를 보여주고, 없으면 상대방의 이미지를 보여준다.
// severside 컴포넌트 : 내 메세지 
// client side 컴포넌트 : 상대방 메세지
export default function ChatMessagesList({
    initialMessages,
    userId, 
    buyerId,
    chatRoomId, 
    username, 
    avatar,
    readMessage,
    product,
    onSold,
  
  } : ChatMessagesListProps) {
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
  const onSubmit = async (event : React.FormEvent) => {
    event.preventDefault(); // 폼 제출 방지하는 이유: 폼 제출 시 페이지가 리로드되기 때문
    // alert(message);
    setMessages(prevMessages => [
      ...prevMessages, 
      {
      id: Date.now(),
      payload: message,
      created_at: new Date(),
      userId,
      isRead: false,
       user: { 
          username:"",
          avatar:"",
       },
    },
  ]);
  channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        created_at: new Date(), 
        payload: message, 
        userId,
        isRead: false,
        user : {
          username,
          avatar,
        },
      },
    });
    await saveMessage(message, chatRoomId);
    setMessage(""); // 메세지 상태 초기화
  };
  useEffect(()=> {
    // 클라이언트 생성
    const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY!);
    // 채팅 채널 생성
    channel.current = client.channel(`room-${chatRoomId}`);
    // 메세지 이벤트 수식어
    channel.current
    .on('broadcast', {event: 'message'}, (payload) =>{
      readMessage(messages[messages.length -1].id);
      console.log(payload);
      setMessages((prevMessages) => [...prevMessages, payload.payload]);
    })
    .subscribe();
    return () => {
      //유저가 이 페이지를 떠나면 unsubscribe
      channel.current?.unsubscribe(); 
    }
  }, []); 
  const ulRef = useRef<HTMLUListElement>(null);
  useEffect(()=> {
    if(ulRef.current) {
      ulRef.current.scrollTop = ulRef.current.scrollHeight;
    }
  }, [ulRef]);

  return (
    <div className="py-5 flex flex-col gap-5 h-screen">
      <div className="w-full flex justify-between border-b-neutral-600 items-center">
        <div className="flex gap-5">
          <Link href="/chat">
            <ChevronLeftIcon className="size-8 text-white cursor-pointer" />
          </Link>
          <h1 className="text-2xl">{product.title}</h1>
        </div>
        {/* 현재 로그인한 사용자가 판매자일 경우 리뷰 버튼을 보이지 않게 함, 
         그리고 판매 완료일 때만 리뷰 버튼을 표시함 */}
        {product.isSold && product.userId !== userId ? (
          <Link
            className="py-2 px-3 bg-orange-500 rounded-md cursor-pointer text-white"
            href={`/profile/user/${
              product.userId === userId ? buyerId : product.userId
            }/review`}
          >
            리뷰 남기기
          </Link>
        ) : (
          <form action={onSold}>
            <button className="py-2 px-3 bg-orange-500 rounded-md cursor-pointer">
              판매 완료
            </button>
          </form>
        )}
      </div>
      <ul
        className="px-3 flex flex-col gap-5 overflow-y-auto flex-1 justify-end"
        ref={ulRef}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 items-start ${
              message.userId === userId && "justify-end"
            }`}
          >
            {message.userId !== userId &&
              (message.user.avatar ? (
                <Image
                  src={message.user.avatar}
                  alt={message.user.username}
                  width={50}
                  height={50}
                  className="size-8 rounded-full"
                />
              ) : (
                <UserIcon className="size-8 rounded-full" />
              ))}
            <div className="flex flex-col gap-1">
              <span
                className={`${
                  message.userId === userId ? "bg-orange-500" : "bg-neutral-500"
                } p-2.5 rounded-md`}
              >
                {message.payload}
              </span>
              <span
                className={`text-xs ${message.userId === userId && "text-end"}`}
              >
                {formatToTimeAgo(message.created_at.toString())}
              </span>
            </div>
          </div>
        ))}
      </ul>
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
          autoComplete="off"
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
  }

//   return (
//   <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
//     {messages.map(message => (
//       <div key={message.id} className={`flex gap-2 items-start ${message.userId === userId ? "justify-end" : ""}`}>
//   {message.userId === userId ? null : (
//     message.user && message.user.avatar ? (
//       <Image 
//         src={message.user.avatar!} 
//         alt={message.user.username || "User avatar"}  
//         width={50} 
//         height={50} 
//         className="rounded-full size-8" 
//       />
//     ) : null
//   )}
  
//   <div className={`flex flex-col gap-1 ${message.userId === userId ? "items-end" : ""}`}>
//     <span className={`${message.userId === userId ? "bg-neutral-500" : "bg-orange-500"} text-white p-2.5 rounded-md`}>
//       {message.payload}
//     </span>
//     <span className="text-xs">
//       {formatToTimeAgo(message.created_at?.toString() || "")}
//     </span>
//   </div>
// </div>
//     ))}
//           <form className="flex relative" onSubmit={onSubmit}>
//         <input
//           required
//           onChange={onChange}
//           value={message}
//           className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
//           type="text"
//           name="message"
//           placeholder="Write a message..."
//         />
//         <button className="absolute right-0">
//           <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
//         </button>
//       </form>
//   </div>
//   ) 
