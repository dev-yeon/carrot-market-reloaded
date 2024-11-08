import type { Config } from 'tailwindcss';

export default {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            margin: {
                'too-high': '120px'
            },
            borderRadius: {
                'sexy-name': '11.11px'
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms') // 플러그인 추가
    ]
} satisfies Config;
