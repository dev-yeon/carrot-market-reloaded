import { error } from 'console';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import getSession from './lib/session';
// response를 나타내는 fetch API
export async function middleware(request: NextRequest) {
    //console.log(request.cookies.getAll());
    // console.log(cookies());
    const session = await getSession();
    console.log(session);
    if (request.nextUrl.pathname === '/profile') {
        return Response.redirect(new URL('/', request.url));
    }
}
