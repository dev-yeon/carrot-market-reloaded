"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { promises } from "dns";
import { productSchema } from "./schema";

// Cloudflare API 응답 타입 정의
type CloudflareUploadResponse = {
  success: boolean;
  result?: {
    id: string;
    uploadURL: string;
  };
  errors?: any[];
  messages?: string[];
};



export async function uploadProduct(formData : FormData) {
  const data = {
    photo: formData.get("photo"),
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
  };
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/products/${product.id}`);
      //redirect("/products")
    }
  }
}

export async function getUploadUrl(): Promise<CloudflareUploadResponse> {
  try {
      const response = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
          {
              method: "POST",
              headers: {
                  Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
              },
          }
      );

      if (!response.ok) {
          const errorText = await response.text();
          console.error("Cloudflare API Error:", response.status, errorText);
          throw new Error(`Failed to fetch upload URL: ${response.statusText}`);
      }

      const data: CloudflareUploadResponse = await response.json();

      if (!data.success) {
          console.error("Cloudflare API responded with errors:", data.errors);
          throw new Error("Cloudflare API responded with an error.");
      }

      if (!data.result?.id || !data.result?.uploadURL) {
          console.error("Invalid response structure:", data);
          throw new Error("Cloudflare API returned invalid result structure.");
      }

      return data;
  } catch (error) {
      console.error("Error in getUploadUrl:", error);
      throw new Error("Could not retrieve upload URL.");
  }
}