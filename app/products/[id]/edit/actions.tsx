"use server" 

import getSession from "@/lib/session"
import db from "@/lib/db"
import { productSchema } from "../../add/schema"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

export async function getProduct(id: number) {
  const product = await db.product.findUnique ({
    where : {
      id,
    },
    select : {
      id:true,
      photo:true,
      title: true,
      price: true,
      description: true,
      userId : true
    },
  });
  return product;
}

export async function deletePhoto(photoId: string) {
  await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v1/${photoId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
}

export async function editProduct(formData: FormData) {
  console.log("Form Data:", Object.fromEntries(formData));

  const session = await getSession();
  if (!session.id) {
    throw new Error("세션이 만료되었습니다.");
    return;
  }
    // FormData에서 `id` 추출 및 검증
    const id = formData.get("id");
    console.log("Extracted Product ID from FormData:", id);
  
    if (!id || isNaN(Number(id))) {
      console.log(id)
      throw new Error("유효하지 않은 Product ID입니다.");
    }

 
  const data = {
    // id: formData.get("id"),
    id: Number(id), // 문자열에서 숫자로 변환
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  console.log("Parsed Data:", data); // data 확인
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log("Zod Parsed Result:", result.data); // 확인용 로그
    // if (!result.data.id) {
    //   console.error("Error: id가 존재하지 않습니다.");
    //   return; // id가 없으면 실행 중단
    // }
    const product = await db.product.update ({
      where : {
        // id: result.data.id
        id: Number(id), // `id`는 수정할 수 없고, 고유 식별자로 사용됨
      },
      data : {

        title: result.data.title, // 제목을 추가합니다.
        price: result.data.price, // 가격을 추가합니다.
        description: result.data.description, // 설명을 추가합니다.
        photo: result.data.photo, // 사진을 추가합니다.
        user : {
          connect : {
            id: session.id,
          },
        },
      },
      select : {
        id: true,
      },
    });
    revalidatePath("/products");
    revalidateTag("product-detail");
    redirect(`/products/${product.id}`);
  }
  
}