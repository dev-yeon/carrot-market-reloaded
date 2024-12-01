import { redirect } from "next/navigation";
import getSession from "./session/getSession";

interface IUser {
  id: number;
}

export default async function userLogin(user: IUser | null) {
  const session = await getSession();
  session.id = user?.id;
  await session.save();
  return redirect("/profile");
}