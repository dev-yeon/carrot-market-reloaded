import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

async function getUser() {
    const session = await getSession();
    console.log("Session user id:", session?.id);
    console.log("Session:", session);
    if (!session || !session.id) {
        notFound();
    }

    const user = await db.user.findUnique({
        where: { id: session.id },
    });
    console.log("User:", user);
    if (!user) {
        //redirect("/login");
        notFound();
    }

    return user;
}

export default async function Profile() {
    const user = await getUser();
    const logOut = async () => {
        'use server';
        //inline server action
        //button 이 눌릴때 마다, form을 submit 한다.
        //cookie 을 삭제하여 log in -> log out
        const session = await getSession();
        if (session) {
            await session.destroy();
        }
        redirect("/login"); // 로그아웃 후 로그인 페이지로 이동
    };
    return (
        <div>
            <h1>Welcome {user?.username}!</h1>
            <form action={logOut}>
                <button>Log out</button>
            </form>
        </div>
    );
}
