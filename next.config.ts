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
            }
        ]
    }
};

export default nextConfig;
