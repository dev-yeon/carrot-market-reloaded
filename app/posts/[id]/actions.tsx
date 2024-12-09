"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag, unstable_cache as nextCache } from "next/cache";

export const likePost = async (postId: number) => {
  try {
    const session = await getSession();
    await db.like.create({
      data: {
        postId: postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
    revalidateTag("posts");
  } catch (e) {}
};
export const dislikePost = async (postId: number) => {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId: postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
    revalidateTag("posts");
  } catch (e) {}
};

export const createComment = async (
  postId: number,
  payload: string,
  userId: number
) => {
  await db.comment.create({
    data: {
      payload,
      userId,
      postId,
    },
  });
  revalidateTag(`comments-${postId}`);
  revalidateTag("posts");
};