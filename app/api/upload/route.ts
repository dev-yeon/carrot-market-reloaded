import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();
    console.log('Cloudflare API 응답:', data);

    if (!response.ok) {
      throw new Error(`Cloudflare API 에러: ${response.status}`);
    }

    return NextResponse.json(data);
    
  } catch (error: unknown) {  // error 타입을 unknown으로 지정
    if (error instanceof Error) {
      console.error('Upload URL 생성 실패:', error.message);
      return NextResponse.json(
        { error: '업로드 URL 생성 실패', details: error.message },
        { status: 500 }
      );
    }
    // 기타 에러 처리
    return NextResponse.json(
      { error: '알 수 없는 에러가 발생했습니다' },
      { status: 500 }
    );
  }
}