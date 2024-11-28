import db from '@/lib/db';
import getSession from '@/lib/session';
import { notFound, redirect } from 'next/navigation';

async function getUser() {
    const session = await getSession();
    console.log("Session:", session);
  
    if (!session?.id) {
      console.log("No session ID. Redirecting to /login...");
      redirect("/login");
      return;
    }
  
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
  
    console.log("User:", user);
  
    if (!user) {
      console.log("No user found. Redirecting to /login...");
      redirect("/login");
      return;
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
