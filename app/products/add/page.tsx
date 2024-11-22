'use client';
import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';
import { uploadProduct } from './actions';

export default function AddProduct() {
    const [preview, setPreview] = useState('');
    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { 
            target: {files}
        } = event;
        if (!files) return;
        const file = files[0];
        const url = URL.createObjectURL(file); // create URL 
        setPreview(url);
    };
    return (
        <div>
            <form 
            action={uploadProduct}
            className="p-5 flex flex-col gap-5">
                <label
                    htmlFor="photo"
                    className="border-2 aspect-square flex items-center justify-center rounded-md flex-col text-neutral-300 border-neutral-300 border-dashed
                    cursor-pointer bg-center bg-cover"
                    style = {{
                        backgroundImage: `url(${preview})`,
                    }}
                >
                    { preview === "" ? <>
                    <PhotoIcon className="w-20" />
                    <div className="text-neutral-400 text-sm">사진을 추가해 주세요.</div>
                    </> : null}
                   
                </label>
                <input
                    onChange={onImageChange}
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    className="hidden"
                />
                <Input
                    name="title"
                    required
                    type="text"
                    placeholder="제목"
                />
                <Input 
                    name="price"
                    required
                    type="number"
                    placeholder="가격"
                />
                <Input
               
                    name="description"
                    required
                    type="text"
                    placeholder="상품의 자세한 설명"
                />
                <Button text="작성완료" />
            </form>
        </div>
    );
}
