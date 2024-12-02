// import { NextRequest, NextResponse } from "next/server";
// import getSession from "./lib/session/getSession";

// interface IPublicURL {
//     [key: string]: boolean;
// }

// const publicURLs: IPublicURL = {
//     "/": true,
//     "/sms": true,
//     "/login": true,
//     "/products": true,
//     "/create-account": true,
//     "/github/start": true,
//     "/github/complete": true,
//     "/account/github/complete": true, // 추가
    
    
// };
// export async function middleware(request: NextRequest) {
//     console.log("middleware! 요청 경로:", request.nextUrl.pathname);

//     try {
//         const session = await getSession(); // getSession 호출
//         console.log("세션 정보:", session);

//         const isPublicPath = publicURLs[request.nextUrl.pathname];
//         console.log("공개 경로 여부:", isPublicPath);

//         if (!session?.id) {
//             if (!isPublicPath) {
//                 console.log("비공개 경로 접근: 리디렉션 /login");
//                 return NextResponse.redirect(new URL("/login", request.url));
//             }
//         } else {
//             if (isPublicPath) {
//                 console.log("공개 경로에 세션 존재: 리디렉션 /profile");
//                 return NextResponse.redirect(new URL("/products", request.url));
//             }
//         }
//     } catch (error) {
//         console.error("getSession 호출 중 오류 발생:", error);
//     }

//     return NextResponse.next();
// }
// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
// };

import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session/getSession";

interface IPublicURL {
    [key: string]: boolean;
}

const publicURLs: IPublicURL = {
    "/": true,
    "/sms": true,
    "/login": true,
    "/products": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true,
    "/account/github/complete": true, // 추가
};

export async function middleware(request: NextRequest) {
    console.log("middleware! 요청 경로:", request.nextUrl.pathname);

    try {
        const session = await getSession(); // getSession 호출
        console.log("세션 정보:", session);

        const isPublicPath = publicURLs[request.nextUrl.pathname];
        console.log("공개 경로 여부:", isPublicPath);

        // 세션이 없는 경우
        if (!session?.id) {
            if (!isPublicPath) {
                console.log("비공개 경로 접근: 리디렉션 /login");
                return NextResponse.redirect(new URL("/login", request.url));
            }
        } 
        // 세션이 있는 경우
        else {
            // 공개 경로 + 이미 /products 페이지에 있을 경우 리디렉션 방지
            if (isPublicPath && request.nextUrl.pathname !== "/products") {
                console.log("공개 경로에 세션 존재: 리디렉션 /products");
                return NextResponse.redirect(new URL("/products", request.url));
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