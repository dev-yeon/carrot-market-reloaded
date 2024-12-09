import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache } from "next/cache";
import LikeButton from "@/components/like-button";
import CommentList from "@/components/comment-list";
import CommentForm from "@/components/comment-form";

const getPost = async (id: number) => {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
};

const getCachedPost = nextCache(getPost, ["post-detail"], { revalidate: 60 });

const getLikeStatus = async (postId: number, userId: number) => {
  const isLiked = Boolean(
    await db.like.findUnique({
      where: {
        id: {
          postId: postId,
          userId: userId,
        },
      },
    })
  );
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return { likeCount, isLiked };
};

const getCachedLikeStatus = (postId: number, userId: number) => {
  const cachedOperation = nextCache(
    getLikeStatus,
    [`post-like-status-${postId}`],
    {
      tags: [`like-status-${postId}`],
    }
  );
  return cachedOperation(postId, userId);
};

const getUser = async (userId: number) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });
  return user;
};

const getCachedUser = (userId: number) => {
  const cachedOperation = nextCache(getUser, [`user-info-${userId}`], {
    tags: [`user-${userId}`, `user-info-${userId}`],
  });
  return cachedOperation(userId);
};

const getComments = async (postId: number) => {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    select: {
      payload: true,
      created_at: true,
      id: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return comments;
};

const getCachedComments = (postId: number) => {
  const cachedOperation = nextCache(getComments, [`post-comment-${postId}`], {
    tags: [`comments-${postId}`],
  });
  return cachedOperation(postId);
};

const PostDetail = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const post = await getCachedPost(id);
  const session = await getSession();
  if (!post) {
    return notFound();
  }
  const comments = await getCachedComments(id);
  const user = await getCachedUser(session.id!);
  const { likeCount, isLiked } = await getCachedLikeStatus(id, session.id!);
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
          priority
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start mb-10">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={id} />
      </div>
      <CommentList postId={id} commentsData={comments} user={user!} />
    </div>
  );
};

export default PostDetail;