import { NextRequest, NextResponse } from 'next/server';
import getSession from './lib/session';

interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    //Object 내에서 뭔가를 포함하는지 검색하는게
    //Array 에서 찾는거 보다 더 빠르다.
    '/': true,
    '/login': true,
    '/sms': true,
    '/create-account': true,
    "/github/start" : true,
    "/github/complete": true,
};

// response를 나타내는 fetch API
export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if (!session.id) {
        if (!exists) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    } else {
        if (exists) {
            return NextResponse.redirect(new URL('/products', request.url));
        }
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
