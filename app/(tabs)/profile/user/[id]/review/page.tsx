import { notFound, redirect } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import db from "@/lib/db";
import getSession from "@/lib/session";

async function getUser(userId: number) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
    },
  });
  return user;
}

function getCachedUser(userId: number) {
  const cachedOperation = nextCache(getUser, [`user-title-${userId}`], {
    revalidate: 300,
  });
  return cachedOperation(userId);
}

const Review = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const user = await getCachedUser(id);
  if (!user) return notFound();
  const session = await getSession();
  if (session.id === user.id) {
    return redirect(`/user/${id}`);
  }
  const onReview = async (formData: FormData) => {
    "use server";
    const payload = formData.get("payload") as string | null;
    if (!payload) return;
    await db.review.create({
      data: {
        payload,
        userId: id,
      },
      select: null,
    });
    revalidateTag(`reviews-${id}`);
    redirect(`/profile/user/${id}`);
  };
  return (
    <div className="flex flex-col gap-5 p-5">
      <h1 className="text-2xl">{user.username}님에 대한 리뷰</h1>
      <form className="flex flex-col gap-3" action={onReview}>
        <textarea
          placeholder="해당 사용자에 대한 리뷰를 작성해 주세요."
          autoComplete="off"
          className="w-full h-32 rounded-md bg-transparent border-white focus:border-white focus:ring-0 text-white placeholder:text-white"
          name="payload"
          required
        />
        <button className="w-full py-2 bg-orange-500 rounded-md">
          작성하기
        </button>
      </form>
    </div>
  );
};

export default Review;