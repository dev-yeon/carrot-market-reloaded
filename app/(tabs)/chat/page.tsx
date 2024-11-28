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
                <div className="flex gap-2 flex-wrap">
                {chatRooms.map((room) => (
                       <Link 
                       href={`/chats/${room.id}`} 
                       key={room.id}
                   >
                    <div  
                        key={room.id} 
                        className="bg-neutral-600 p-4 rounded-lg hover:bg-neutral-700 transition flex flex-row gap-2"
                    >   
                <Image src={room.users[0].avatar!} alt={room.users[0].username} width={50} height={50} className="rounded-full size-20" />
                    <div className="flex flex-col gap-2">
                
                        <h2 className="text-white text-xl">{room.users[0].username}</h2>
                        <h2>{room.messages && room.messages.length > 0 ? room.messages[room.messages.length - 1].payload
: '메시지가 없습니다.'}
</h2>
                        </div>
                        <p className="text-gray-400">
                            참여자: {room.users.length}명
                        </p>
                    </div>
                    </Link>
                ))}   
               
                </div>
            </div>
        </div>
    );
}
