import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // console.log(request);
  console.log("✅ Request received at /login/github/complete");
  return Response.json({
    ok: true,
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  // console.log("log the user in");
  return Response.json(data);
}