import PrismaDB from "@/lib/db";
import getSession from "@/lib/session/getSession";
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
        <div>
            <h1>This is profile page {user?.username}</h1>
            <form action={logout}>
                <button type="submit">logout</button>
            </form>
        </div>
    );
}