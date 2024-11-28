import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

async function getUser() {
    const session = await getSession();
    console.log("Session  user id:", session?.id);
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id
            }
        });
        if (user) {
            return user;
        }
         // 세션 또는 사용자 정보가 없을 경우 로그인 페이지로 이동
  redirect("/login");
  return; 
    }
    //session이 ID가 없는 경우, notFound가 실행되 링크로 접속해도 페이지 보호 가능
    notFound();
}

export default async function Profile() {
    const user = await getUser();
    const logOut = async () => {
        'use server';
        //inline server action
        //button 이 눌릴때 마다, form을 submit 한다.
        //cookie 을 삭제하여 log in -> log out
        const session = await getSession();
        await session.destroy();
        redirect('/');
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
