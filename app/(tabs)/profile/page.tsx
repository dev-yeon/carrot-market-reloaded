import PrismaDB from "@/lib/db";
import getSession from "@/lib/session/getSession";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function getUser() {
    const session = await getSession();
    if (session.id) {
        const user = await PrismaDB.user.findUnique({
            where: {
                id: session.id,
            },
        });

        if (user) {
            return user;
        }
    }
    notFound();
}

export default async function Profile() {
    const user = await getUser();

    async function logout() {
        "use server";
        const session = await getSession();
        session.destroy();
        redirect("/");
    }

    return (
        <div className="flex flex-col gap-3">
            <h1>안녕하세요, {user?.username} 님</h1>
            <form action={logout}>
                <button type="submit">logout</button>
            </form>
            <Link 
                href={`profile/user/${user.id}`}
                className="py-2 px-4 bg-orange-500 rounded-md text-white w-fit"
            >
                See profile
            </Link>
            <Link 
                href={`/profile/edit`}
                className="px-3 py-2 rounded-md bg-blue-500 w-fit cursor-pointer text-white"
            >
                프로필 수정
            </Link>
        </div>
    );
}

