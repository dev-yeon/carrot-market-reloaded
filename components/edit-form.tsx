"use client"

import { deletePhoto, editProduct } from "@/app/products/[id]/edit/actions";
import { getUploadUrl } from "@/app/products/add/actions";
import { productSchema, ProductType } from "@/app/products/add/schema";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "@/components/input";
import Button from "./button";



const EditForm = ({
  id,
  product,
  isOwner,
} : {
  id: number;
  product: ProductType; 
  isOwner : boolean;
}) => {
  console.log("Received ID:", id); // 이 부분에서 id 확인
  const [preview, setPreview] = useState(`${product.photo}/public`)
  const [uploadUrl, setUploadUrl ] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState : {errors}, 

  } = useForm<ProductType>({
    resolver : zodResolver(productSchema), 
  });
  const onSubmit = handleSubmit(async (data: ProductType) => {
    if(!file && !preview) return; 
    
    if(file) {
      const photoId = product.photo.split(
      `https://imagedelivery.net/x2-hEWxzt28Xj_5D6gCpFw/`)[1];
      await deletePhoto(photoId);
      const cloudFlareForm = new FormData();
      cloudFlareForm.append("file", file);
      const response = await fetch(uploadUrl, {
        method: "POST",
        body : cloudFlareForm,
      });
      if (response.status !== 200) {
        return alert("이미지 업로드에 실패했습니다.")
      }
    }
    //수정할 필드만 FormData에 담아야 해 
    const formData = new FormData();
    // if (id) {
    //   formData.append("id", id.toString()); // id가 undefined가 아닌지 확인 후 추가
    // } else {
    //   console.error("Error: ID is missing in EditForm props");
    // }
    formData.append("id", id.toString());
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price +"");
    console.log(data.photo);
    formData.append("photo", data.photo);
    // 서버에 id는 별도로 전달한다. 
    
    const errors = await editProduct(formData);
    if (errors) {
      if (errors.fieldErrors.photo) {
        setError("photo", {message : errors.fieldErrors.photo[0]});
      }
      if (errors.fieldErrors.title) {
        setError("title", {message : errors.fieldErrors.title[0]});
      }
      if (errors.fieldErrors.price) {
        setError("price", {message : errors.fieldErrors.price[0]});
      }
      if (errors.fieldErrors.description) {
        setError("description", {message : errors.fieldErrors.description[0]});
      }
    }
  });

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target : {files},
    } = event;
    if (!files) return;
    if (files.length !== 1) return alert("파일은 한개만 업로드 해야 합니다.");
    const MB = 1024 * 1024; // 1MB
  if(files[0].size > 5 * MB) return alert("파일은 최대 5MB 이어야 합니다.");
  const file = files[0];
  const url = URL.createObjectURL(file); 
  setPreview(url);
  setFile(file);
  const { success, result } = await getUploadUrl();
  if(success && result) {
    const { id, uploadURL} = result;
    setUploadUrl(uploadURL);
    setValue (
      "photo",
      `https://imagedelivery.net/x2-hEWxzt28Xj_5D6gCpFw/${id}`
      );
    }
  };
  const onValid = async() => {
    await onSubmit();
  };
  useEffect(()=> {
    const photoId = product.photo.split(
      "https://imagedelivery.net/x2-hEWxzt28Xj_5D6gCpFw/")[1];
      setValue(
        "photo",
        `https://imagedelivery.net/x2-hEWxzt28Xj_5D6gCpFw/${photoId}`
      );

  }, [product, setValue]); 
  return (
    <form action = {onValid} className="p-5 flex flex-col gap-3">
      <label
        htmlFor="photo"
        className="border-2 aspect-square flex flex-col items-center justify-center gap-3 text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
        style={{
          backgroundImage : `url(${preview})`,
        }}
        >
          {preview === "" ? (
            <>
            <PhotoIcon className="size-20" />
            <div className="text-sm text-neutral-400">
              사진을 추가해 주세요.
            </div>
            </>
          ): null}
        </label>
        {
          <span className="text-red-500 font-medium">
            {errors.photo?.message}
          </span>
        }
        <input
          type="file"
          id ="photo"
          name = "photo"
          className="hidden"
          accept="image/*"
          onChange={onImageChange}
        />
        <Input
          required 
          placeholder="제목"
          defaultValue={product.title}
          type="text"
          errors={[errors.title?.message ?? ""]}
          {...register("title")}
          />
          <Input
            required 
            placeholder="가격"
            defaultValue={product.price}
            type="price"
            errors={[errors.price?.message ?? ""]}
            {...register("price")}
          />
          <Input
            required 
            placeholder="자세한 설명"
            defaultValue={product.description}
            type="description"
            errors={[errors.description?.message ?? ""]}
            {...register("description")}
          />
          <Button text="수정하기" />
  
    </form>
  );
};

export default EditForm;