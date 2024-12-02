import { NextResponse } from "next/server";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    // OAuth 콜백 처리 로직
    return NextResponse.json({ message: "OAuth Callback Received", code });
  }

  const baseURL = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${process.env.REDIRECT_URI}`, // 명시적 redirect_uri 추가
    scope: "read:user,user:email",
    allow_signup: "true",
    // redirect_uri: `${process.env.REDIRECT_URI}/github/complete`, // 콜백 URL 명시
  };

  // URL 파라미터 생성
  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;

  // 디버깅용 finalUrl 로깅
  console.log("Generated finalUrl:", finalUrl);

  // GitHub OAuth로 리다이렉트
  return NextResponse.redirect(finalUrl);
  // const formattedParams = new URLSearchParams(params).toString();
  // const finalUrl = `${baseURL}?${formattedParams}`;
  // console.log("finalUrl", finalUrl);
  // return NextResponse.redirect(finalUrl);
}