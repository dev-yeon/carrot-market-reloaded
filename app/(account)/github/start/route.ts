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
    scope: "read:user,user:email",
    allow_signup: "true",
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/github/complete`, // 콜백 URL 명시
  };
  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;
  console.log("finalUrl", finalUrl);
  return NextResponse.redirect(finalUrl);
}