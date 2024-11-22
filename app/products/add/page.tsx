'use client';
import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function AddProduct() {
    const [preview, setPreview] = useState('');
    const onImageChange = () => {};
    return (
        <div>
            <form className="p-5 flex flex-col gap-5">
                <label
                    htmlFor="photo"
                    className="border-2 aspect-square flex items-center justify-center rounded-md flex-col text-neutral-300 border-neutral-300 border-dashed
                    cursor-pointer"
                >
                    <PhotoIcon className="w-20" />
                    <div className="text-neutral-400 text-sm">사진을 추가해 주세요.</div>
                </label>
                <input onChange={onImageChange} type="file" id="photo" name="photo" className="hidden" />
                <Input name="title" required type="text" placeholder="제목" />
                <Input name="price" required type="number" placeholder="가격" />
                <Input name="description" required type="text" placeholder="상품의 자세한 설명" />
                <Button text="작성완료" />
            </form>
        </div>
    );
}
