import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true // 빌드 시 ESLint 오류 무시
    },
    images: {
        remotePatterns: [
            {
                hostname: 'avatars.githubusercontent.com'
            },
            {
                hostname: 'imagedelivery.net' // 허용할 도메인 추가
            }
        ]
    },
    async rewrites() {
        return [
          {
            source: "/api/github/:path*", // 프록시 경로
            destination: "https://github.com/:path*", // GitHub API로 요청 전달
          },
          
        ];
      },
};

export default nextConfig;
