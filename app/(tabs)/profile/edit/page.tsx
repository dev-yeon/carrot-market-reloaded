import db from "@/lib/db";
import getSession from "@/lib/session";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

async function getUser(userId: number) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      username: true,
      avatar: true,
      password: true,
    },
  });
  return user;
}

const getCachedUser = (userId: number) => {
  const cachedOperation = nextCache(getUser, [`user-edit-${userId}`], {
    tags: [`user-${userId}`, `user-edit-${userId}`],
  });
  return cachedOperation(userId);
};

const ProfileEdit = async () => {
  const session = await getSession();
  const user = await getCachedUser(session.id!);
  const editProfile = async (formData: FormData) => {
    "use server";
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!username || !email || !password) return;
    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        avatar: user?.avatar,
        username,
        email,
        password: await bcrypt.hash(password, 12),
      },
    });
    revalidateTag(`user-${user?.id}`);
    redirect(`/profile/user/${user?.id}`);
  };
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-4xl">프로필 수정</h1>
      <form action={editProfile} className="flex flex-col gap-3">
        {/* <label htmlFor="avatar">유저 아바타</label>
        <input
          type="file"
          name="avatar"
          id="avatar"
          accept="image/*"
          className="w-full rounded-md bg-transparent text-white"
        /> */}

        <label htmlFor="username">이름</label>
        <input
          placeholder="이름을 입력해 주세요."
          defaultValue={user?.username}
          className="w-full rounded-md bg-transparent text-white"
          name="username"
          id="username"
          required
        />
        <label htmlFor="username">이메일</label>
        <input
          placeholder="이메일을 입력해 주세요."
          defaultValue={user?.email ?? ""}
          className="w-full rounded-md bg-transparent text-white"
          name="email"
          id="email"
          required
        />
        <label htmlFor="username">비밀번호</label>

        <input
          placeholder="비밀번호를 입력해 주세요."
          type="password"
          className="w-full rounded-md bg-transparent text-white"
          name="password"
          id="password"
          required
        />
        <button className="bg-orange-500 rounded-md cursor-pointer py-2 transition-colors hover:bg-orange-400">
          수정하기
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;