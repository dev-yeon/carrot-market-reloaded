import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

interface SessionContent {
    id?: number;
}

export default async function getSession() {
    return getIronSession<SessionContent>(await cookies(), {
        cookieName: 'delicious-carrot',
        password: process.env.COOKIE_PASSWORD! || '32자_이상의_임의의_긴_비밀번호'
    });
}
