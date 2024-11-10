import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    console.log(request);
    return Response.json({
        ok: true
    });
}
//함수 이름을 GET로 지으면, 그 안의 코드는 자동으로 GET request 를 처리한다.

// POST requesr
// 로그인 한 유저가 폼을 채워서 제출을 클릭하면,
// 데이터를 얻기 위해선 request의 body를 읽어야 함

// request.json(); -> request의 body를 돌려줌,
export async function POST(request: NextRequest) {
    const data = await request.json();
    console.log('log the user in!');
    return Response.json(data);
}

//Route Handlers

// Route Handlers를 사용하면 웹 요청 및 응답 API를 사용하여 특정 경로에 대한 사용자 커스텀 요청 핸들러를 생성할 수 있습니다.
// Route Handlers는 app 디렉터리 내에서만 사용할 수 있습니다.

// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
