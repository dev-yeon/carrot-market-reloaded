// import { getIronSession } from 'iron-session';
// import { cookies } from 'next/headers';

// interface SessionContent {
//     id?: number;
// }

// export default async function getSession() {
//     return getIronSession<SessionContent>(await cookies(), {
//         cookieName: 'delicious-carrot',
//         password: process.env.COOKIE_PASSWORD! || '32자_이상의_임의의_긴_비밀번호'
//     });
// }
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { User } from '@prisma/client';
interface SessionContent {
    id?: number;
}

export default async function getSession() {
    return getIronSession<SessionContent>(await cookies(), {
        cookieName: 'delicious-carrot',
        password: process.env.COOKIE_PASSWORD! || '32자_이상의_임의의_긴_비밀번호'
    });
}
export async function saveSession(userId: User["id"]) {
    const session = await getIronSession<SessionContent>(await cookies(), {
      cookieName: `delicious-carrot-session`,
      password: process.env.COOKIE_PASSWORD!,
    });
  
    session.id = userId; // 사용자 ID 저장
    await session.save(); // 세션 저장
  }
  declare module "iron-session" {
    interface IronSessionData {
      user?: {
        id: string;
        username?: string;
      };
    }
  }