"use server";


import { z } from "zod";
 
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const productSchema = z.object({
  photo: z.string({
    required_error: "photo is required",
  }),
  title: z.string({
    required_error: "title is required",
  }),
  description: z.string({
    required_error: "description is required",
  }),
  price: z.coerce.number({
    required_error: "price is required",
  }), // 문자열을 숫자로 변환 

})

export async function uploadProduct (_:any,  formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  // const result = productSchema.parse(data);
  const result = productSchema.safeParse(data); 
  //safeParse 는 데이터를 검증하고 결과를 반환 
  if(!result.success) {
    return result.error.flatten();
    } else {
      const session = await getSession();
      if(session.id) { // 세션이 있으면 상품 생성 
        const product =  await db.product.create({
          data : {
          title : result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user : {
            connect : {
              id : session.id,
            },
          },
        }, 
        select : { 
          id : true, // 생성된 상품의 id 를 선택 
        }
        });
        // 상품 생성 후 상품 상세 페이지로 리다이렉트 
        redirect(`/products/${product.id}`);
        

      } 


    }
  }



export async function getUploadUrl(file: File) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API 응답:', data);  // 응답 확인
    return data;
    
  } catch (error) {
    console.error('getUploadUrl 에러:', error);
    throw error;
  }
}