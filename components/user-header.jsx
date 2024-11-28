import getSession from '@/lib/session';

export default async function Header() {
  const session = await getSession();

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800 text-white p-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Chat Application</h1>
        <div className="flex items-center gap-4"> {/* 버튼과 사용자 정보를 감싸는 div 추가 */}
          <p className="text-sm">
            현재 로그인된 사용자:{" "}
            <span className="font-medium">
              {session?.id ? `User ${session.id}` : "Guest"}
            </span>
          </p>
          <a 
            href="/create-account" 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm font-medium transition-colors"
          >
            회원가입
          </a>
        </div>
      </div>
    </header>
  );
}