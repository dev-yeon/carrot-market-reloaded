'use client';

import {
    HomeIcon as SolidHomeIcon,
    NewspaperIcon as SolidNewspaperIcon,
    ChatBubbleOvalLeftEllipsisIcon as SolidChatBubbleOvalLeftEllipsisIcon,
    VideoCameraIcon as SolidVideoCameraIcon,
    UsersIcon as SolidUsersIcon
} from '@heroicons/react/24/solid';
import {
    HomeIcon as OutlineHomeIcon,
    NewspaperIcon as OutlineNewspaperIcon,
    ChatBubbleOvalLeftEllipsisIcon as OutlineChatBubbleOvalLeftEllipsisIcon,
    VideoCameraIcon as OutlineVideoCameraIcon,
    UsersIcon as OutlineUsersIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TabBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-screen-md border-t border-neutral-600 bg-neutral-800">
            <div className="grid grid-cols-5">
                <Link href="/products" className="flex flex-col items-center justify-center p-2">
                    {pathname === '/products' ? (
                        <SolidHomeIcon className="h-6 w-6 text-white" />
                    ) : (
                        <OutlineHomeIcon className="h-6 w-6 text-white" />
                    )}
                    <span className="mt-1 text-xs text-white">홈</span>
                </Link>

                <Link href="/life" className="flex flex-col items-center justify-center p-2">
                    {pathname === '/life' ? (
                        <SolidNewspaperIcon className="h-6 w-6 text-white" />
                    ) : (
                        <OutlineNewspaperIcon className="h-6 w-6 text-white" />
                    )}
                    <span className="mt-1 text-xs text-white">동네생활</span>
                </Link>

                <Link href="/chat" className="flex flex-col items-center justify-center p-2">
                    {pathname === '/chat' ? (
                        <SolidChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-white" />
                    ) : (
                        <OutlineChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-white" />
                    )}
                    <span className="mt-1 text-xs text-white">채팅</span>
                </Link>

                <Link href="/live" className="flex flex-col items-center justify-center p-2">
                    {pathname === '/live' ? (
                        <SolidVideoCameraIcon className="h-6 w-6 text-white" />
                    ) : (
                        <OutlineVideoCameraIcon className="h-6 w-6 text-white" />
                    )}
                    <span className="mt-1 text-xs text-white">쇼핑</span>
                </Link>

                <Link href="/profile" className="flex flex-col items-center justify-center p-2">
                    {pathname === '/profile' ? (
                        <SolidUsersIcon className="h-6 w-6 text-white" />
                    ) : (
                        <OutlineUsersIcon className="h-6 w-6 text-white" />
                    )}
                    <span className="mt-1 text-xs text-white">나의 당근</span>
                </Link>
            </div>
        </nav>
    );
}