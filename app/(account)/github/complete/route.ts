import PrismaDB from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import UpdateSession from "@/lib/session/updateSession";
import getAccessToken from "@/lib/auth/github/getAccessToken";
import getGithubProfile from "@/lib/auth/github/getGithubProfile";
import getGithubEmail from "@/lib/auth/github/getGithubEmail";
import isExistUsername from "@/lib/auth/isExistUsername";
import { saveSession } from "@/lib/session";

// export async function GET(request: NextRequest) {
//     try {
//         // GitHub에서 전달된 인증 코드 가져오기
//         const code = request.nextUrl.searchParams.get("code");
//         if (!code) {
//             console.error("인증 코드 누락");
//             return new Response("Authorization code is missing", { status: 400 });
//         }

//         // 액세스 토큰 가져오기
//         const { error, access_token } = await getAccessToken(code);
//         if (error || !access_token) {
//             console.error("액세스 토큰 가져오기 실패:", error);
//             return new Response("Failed to fetch access token", { status: 400 });
//         }

//         // GitHub 이메일 가져오기 (필요 시 사용)
//         const email = await getGithubEmail(access_token);
//         console.log("사용자 이메일:", email);

//         // GitHub 프로필 정보 가져오기
//         const { id, name, profile_photo } = await getGithubProfile(access_token);

//         // GitHub 이름 유효성 검증
//         const username = name || `user-${id}`;
//         console.log("사용자 이름:", username);

//         // 기존 사용자 확인
//         const user = await PrismaDB.user.findUnique({
//             where: { github_id: id.toString() },
//             select: { id: true },
//         });

//         if (user) {
//             // 기존 사용자: 세션 업데이트 후 리디렉션
//             await UpdateSession(user.id);
//             return redirect("/profile");
//         }

//         // 새로운 사용자 생성
//         const isExist = await isExistUsername(username);
//         const newUser = await PrismaDB.user.create({
//             data: {
//                 github_id: id.toString(),
//                 avatar: profile_photo,
//                 username: isExist ? `${username}-gh` : username,
//             },
//             select: { id: true },
//         });

//         // 세션 업데이트 및 리디렉션
//         await UpdateSession(newUser.id);
//         return redirect("/profile");
//     } catch (error) {
//         console.error("GET 처리 중 오류 발생:", error);
//         return new Response("Internal Server Error", { status: 500 });
//     }
// }
export async function GET(request: NextRequest) {
  try {
    // GitHub에서 전달된 인증 코드 가져오기
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
      console.error("Authorization code is missing");
      return new Response(
        JSON.stringify({ error: "Authorization code is missing" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 액세스 토큰 가져오기
    const { error: tokenError, access_token } = await getAccessToken(code);
    if (tokenError || !access_token) {
      console.error("Failed to fetch access token:", tokenError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch access token" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // GitHub 프로필 정보 가져오기
    const { id, name, profile_photo } = await getGithubProfile(access_token);

    // GitHub 이메일 가져오기
    const email = await getGithubEmail(access_token);
    console.log("GitHub user email:", email);

    // 기존 사용자 확인
    const existingUser = await PrismaDB.user.findUnique({
      where: { github_id: id.toString() },
      select: { id: true },
    });

    if (existingUser) {
      // 기존 사용자: 세션 업데이트 후 리디렉션
      await UpdateSession(existingUser.id);
      return redirect("/profile");
    }

    // 새로운 사용자 생성
    const username = name || `user-${id}`;
    const isExist = await isExistUsername(username);
    const newUser = await PrismaDB.user.create({
      data: {
        github_id: id.toString(),
        avatar: profile_photo,
        username: isExist ? `${username}-gh` : username,
      },
      select: { id: true },
    });

    // 세션 업데이트 및 리디렉션
    await UpdateSession(newUser.id);
    await saveSession(newUser.id);
    return redirect("/profile");
  } catch (error) {
    console.error("Error handling GET request:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}