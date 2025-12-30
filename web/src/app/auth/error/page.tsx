import Link from 'next/link';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="text-red-500 text-5xl">!</div>
        <h1 className="text-2xl font-bold text-gray-900">로그인 오류</h1>
        <p className="text-gray-600">
          로그인 중 문제가 발생했습니다.<br />
          회사 이메일로 다시 시도해주세요.
        </p>
        <Link
          href="/auth/login"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 로그인
        </Link>
      </div>
    </div>
  );
}
