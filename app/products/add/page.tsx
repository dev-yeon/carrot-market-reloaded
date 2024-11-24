'use client';
import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import React, { useCallback, useState } from 'react';
import { getUploadUrl, uploadProduct } from './actions';
import { useActionState } from 'react';

export default function AddProduct() {
    // useFormState를 최상단으로 이동
    const [state, formAction] = useActionState(uploadProduct, null);
    const [preview, setPreview] = useState('');
    const [uploadUrl, setUploadUrl] = useState(''); 

    // useCallback으로 이벤트 핸들러 메모이제이션
    const onImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target: {files} } = event;
        if (!files) return;
        const file = files[0];
        
        // 비동기 작업을 try-catch로 감싸기
        // try {
        //     setPreview(URL.createObjectURL(file));
        //     const response = await getUploadUrl(file);
        //     console.log(response);
        //     setUploadUrl(response.uploadURL);
        // } catch (error) {
        //     console.error('Image upload error:', error);
        // }
        try {
            console.log('파일 업로드 시작:', file);  // 파일 객체 확인
            setPreview(URL.createObjectURL(file));
            
            console.log('getUploadUrl 호출 전');
            const response = await getUploadUrl(file);
            console.log('getUploadUrl 응답:', response);
            
            if (!response) {
                throw new Error('업로드 URL을 받지 못했습니다');
            }
            
            setUploadUrl(response.uploadURL);
        } catch (error) {
            console.error('상세 에러:', error);  // 더 자세한 에러 정보
        }
    }, []);
    return (
        <div>
            <form 
            action={formAction}
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
                    <div className="text-neutral-400 text-sm">사진을 추가해 주세요.
                         {state?.fieldErrors.photo}
                    </div>
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
                    errors={state?.fieldErrors.title}
                />
                <Input 
                    name="price"
                    required
                    type="number"
                    placeholder="가격"
                    errors={state?.fieldErrors.price}
                />
                <Input
               
                    name="description"
                    required
                    type="text"
                    placeholder="상품의 자세한 설명"
                    errors = {state?.fieldErrors.description}
                />
                <Button text="작성완료" />
            </form>
        </div>
    );
}
