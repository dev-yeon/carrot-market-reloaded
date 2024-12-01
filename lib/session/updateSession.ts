import getSession from "@/lib/session/getSession";

export default async function UpdateSession(id: number) {
    const session = await getSession();
    session.id = id;
    await session.save();
}