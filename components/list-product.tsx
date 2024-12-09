import { formatToTimeAgo, formatToWon } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface ListProductProps {
    id: number;
    title: string;
    price: number;
    created_at: Date;
    photo: string;
    isSold: boolean; 
}

export default function ListProduct({ 
    id,
    title,
    price,
    created_at,
    photo,
    isSold,
 }: ListProductProps) {
    console.log("isSold 상태:", isSold);
    console.log("이미지 경로:", `${photo}/avatar`);
    return (
        <Link href={`/products/${id}`} className="flex gap-5">
            <div className="relative size-28 rounded-md overflow-hidden">
                <Image 
                    fill 
                    src={`${photo}/avatar`} 
                    className={`object-cover rounded-lg ${isSold ? 'grayscale opacity-50': ''}`}
                    alt={title} 
                />
                {/* 판매완료표시 */}
                {isSold && (
                    <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white text-2xl font-bold'>
                      판매 완료
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-1 *:text-white">
                <span className="text-lg">{title}</span>
                <span className="text-sm text-neutral-500">{formatToTimeAgo(created_at.toString())}</span>
                <span className="text-lg font-semibold">{formatToWon(price)}원</span>
            </div>
        </Link>
    );
}
