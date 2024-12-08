"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export const editProfile = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.id) throw new Error("세션이 만료되었습니다.");

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const avatarFile = formData.get("avatar") as File | null;

  if (!username || !email || !password) return;

  // 기존 아바타 유지
  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { avatar: true },
  });
  let avatarUrl = user?.avatar;

  // 파일 업로드 로직
  if (avatarFile && avatarFile.size > 0) {
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", avatarFile);

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
        },
        body: cloudflareForm,
      }
    );

    const uploadResult = await response.json();
    if (response.ok && uploadResult.success) {
      avatarUrl = uploadResult.result.variants[0]; // 업로드된 이미지 URL
    } else {
      throw new Error("이미지 업로드 실패");
    }
  }

  // DB 업데이트
  await db.user.update({
    where: { id: session.id },
    data: {
      username,
      email,
      password: await bcrypt.hash(password, 12),
      avatar: avatarUrl,
    },
  });

  // 캐시 무효화 및 리다이렉트
  revalidateTag(`user-${session.id}`);
  redirect(`profile/user/${session.id}`);
};