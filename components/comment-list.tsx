"use client";

import { createComment } from "@/app/posts/[id]/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { startTransition, useOptimistic } from "react";
import CommentForm from "./comment-form";
import Image from "next/image";

interface IComment {
  id: number;
  created_at: Date;
  user: {
    username: string;
    avatar: string | null;
  };
  payload: string;
}

interface ICommentListProps {
  postId: number;
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
  commentsData: IComment[];
}

const CommentList = ({ commentsData, postId, user }: ICommentListProps) => {
  const [comments, reducerFn] = useOptimistic(
    commentsData,
    (prevComments, payload: string) => {
      const id = (prevComments[0]?.id ?? 0) + 1;
      return [
        {
          id,
          created_at: new Date(),
          user: user!,
          payload,
        },
        ...prevComments,
      ];
    }
  );
  const handleSubmit = async (payload: string) => {
    startTransition(() => {
      reducerFn(payload);
    });
    await createComment(postId, payload, user.id);
  };
  return (
    <>
      <CommentForm handleSubmit={handleSubmit} />
      <ul className="flex flex-col gap-5 mt-5">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-5">
            <div className="flex flex-col gap-1 items-center">
              <Image
                src={comment.user.avatar ?? ""}
                alt={comment.user.username}
                width={32}
                height={32}
                className="object-cover rounded-full"
                priority
              />
              <h3>{comment.user.username}</h3>
            </div>
            <div className="flex flex-col justify-center gap-1">
              <h2 className="text-lg">{comment.payload}</h2>
              <h3 className="text-sm text-neutral-400">
                {formatToTimeAgo(comment.created_at.toString())}
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CommentList;