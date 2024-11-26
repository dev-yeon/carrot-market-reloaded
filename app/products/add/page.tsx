"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useActionState, useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setImageId] = useState("");
  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    const { success, result } = await getUploadUrl();
    if (success && result) {
      console.log("Upload URL result:", result); // 결과 확인
      const { id, uploadURL } = result;
      console.log("ID:", id); // id 값 확인
      console.log("Upload URL:", uploadURL); // uploadURL 값 확인
      setUploadUrl(uploadURL);
      setImageId(id);
    } else {
      console.error("Failed to get upload URL:", result); // 실패 케이스 확인
    
    }
  };
  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    console.log(await response.text());
    if (response.status !== 200) {
      console.error("Upload failed:", await response.text());
      return;
    }
    console.log("PhotoId in interceptAction:", photoId); // photoId 값 확인
    const photoUrl = `https://imagedelivery.net/x2-hEWxzt28Xj_5D6gCpFw/${photoId}`;
    formData.set("photo", photoUrl);
    console.log("Photo ID:", photoId);
    console.log("Upload URL:", uploadUrl);
    console.log("Final Photo URL:", photoUrl);
    return uploadProduct(_, formData); // 
  };
  const [state, action] =  useActionState(interceptAction, null);
  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          ) : null}
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
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <Input
          name="price"
          type="number"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
        />
        <Input
          name="description"
          type="text"
          required
          placeholder="자세한 설명"
          errors={state?.fieldErrors.description}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}