"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import {  useState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductType } from "./schema";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [file, setFile] = useState<File|null>(null);

  const { 
      register,
      handleSubmit, 
      setValue, 
      setError,
      formState: {errors},
     } = useForm<ProductType>({
    resolver : zodResolver(productSchema), // validation 값을 받을 수 있다. 
  });
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
    setFile(file);
    const { success, result } = await getUploadUrl();
    if (success && result) {
      // console.log("Upload URL result:", result); // 결과 확인
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setValue(
        "photo",
        `https://imagedelivery.net/x2-hEWxzt28Xj_5D6gCpFw/${id}`
      );
    } else {
      console.error("Failed to get upload URL:", result); // 실패 케이스 확인
    }
  };
  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });
    if (response.status !== 200) {
      console.error("Upload failed:", await response.text());
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price +"");
    formData.append("description", data.description);
    formData.append("photo", data.photo);
    // return uploadProduct(formData); 
    const errors = await uploadProduct(formData);
    if (errors) {
      setError("photo", {
        type: "manual",      // 오류 유형. 보통 수동 설정 시 "manual"을 사용
        message: "사진을 업로드 해주세요." // 사용자에게 표시할 오류 메시지
      }, {
        shouldFocus: true    // true로 설정하면 해당 필드에 포커스를 이동
      });
      setError("title", {
        type: "manual",      // 오류 유형. 보통 수동 설정 시 "manual"을 사용
        message: "제목을 써주세요." // 사용자에게 표시할 오류 메시지
      }, {
        shouldFocus: true    // true로 설정하면 해당 필드에 포커스를 이동
      });
      setError("description", {
        type: "manual",      // 오류 유형. 보통 수동 설정 시 "manual"을 사용
        message: "설명을 작성 해주세요." // 사용자에게 표시할 오류 메시지
      }, {
        shouldFocus: true    // true로 설정하면 해당 필드에 포커스를 이동
      });
    }
  });
  const onValid = async () => {
    await onSubmit();
  };
  // const [state, action] =  useActionState(interceptAction, null);
  // const onValid = (data: ProductType)
  console.log("register:::",register("title"));
  return (
    <div>
      <form action={onValid}  className="p-5 flex flex-col gap-5">
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
                {errors?.photo?.message}
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
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          type="number"
          required
          {...register("price")}
          placeholder="가격"
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          type="text"
          required
          {...register("description")}
          placeholder="자세한 설명"
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}