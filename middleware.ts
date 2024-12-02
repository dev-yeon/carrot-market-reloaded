import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session/getSession";

interface IPublicURL {
    [key: string]: boolean;
}

const publicURLs: IPublicURL = {
    "/": true,
    "/sms": true,
    "/login": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true,
    "/account/github/complete": true, // 추가
    "/profile": true,
    
};
export async function middleware(request: NextRequest) {
    console.log("middleware! 요청 경로:", request.nextUrl.pathname);

    try {
        const session = await getSession(); // getSession 호출
        console.log("세션 정보:", session);

        const isPublicPath = publicURLs[request.nextUrl.pathname];
        console.log("공개 경로 여부:", isPublicPath);

        if (!session?.id) {
            if (!isPublicPath) {
                console.log("비공개 경로 접근: 리디렉션 /");
                return NextResponse.redirect(new URL("/", request.url));
            }
        } else {
            if (isPublicPath) {
                console.log("공개 경로에 세션 존재: 리디렉션 /profile");
                return NextResponse.redirect(new URL("/profile", request.url));
            }
        }
    } catch (error) {
        console.error("getSession 호출 중 오류 발생:", error);
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};