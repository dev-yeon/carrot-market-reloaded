"use server";

import db from "@/lib/db";
import { revalidateTag } from "next/cache";

export async function markMessageAsRead(messageId: number) {
  await db.message.update({
    where: { id: messageId },
    data: { isRead: true },
  });
  revalidateTag("chat-list");
}

export async function markProductAsSold(productId: number, currentUserId: number, otherUserId: number) {
  await db.product.update({
    where: { id: productId },
    data: { isSold: true },
  });
  revalidateTag(`user-profile-${currentUserId}`);
  revalidateTag(`user-profile-${otherUserId}`);
  revalidateTag("chat-list");
}