import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LoginButton } from '@/components/LoginButton';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 로그인된 사용자는 대시보드로 리다이렉트
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black overflow-hidden">
      {/* 히어로 섹션 */}
      <section className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* 로고/브랜드 */}
            <div className="mb-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                Catering
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                자동 케이터링 예약 시스템
              </p>
            </div>

            {/* 핵심 메시지 */}
            <div className="max-w-3xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
                오후 3시 정각,
                <br />
                <span className="text-blue-600 dark:text-blue-400">자동으로</span> 예약하세요
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                수동으로 대기하고 클릭할 필요 없습니다.
                <br />
                설정만 하면 정확한 시간에 자동으로 예약이 완료됩니다.
              </p>
            </div>

            {/* CTA 버튼 */}
            <div className="flex flex-col gap-3 justify-center items-center">
              <LoginButton />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                @oliveyoung.co.kr 이메일만 사용 가능합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              주요 기능
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              간편하고 정확한 자동 예약 시스템
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 기능 1: 정확한 시간 예약 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                정확한 시간 예약
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                오후 3시 정각에 자동으로 실행됩니다. 밀리초 단위의 정확한 타이밍으로 예약 성공률을 극대화합니다.
              </p>
            </div>

            {/* 기능 2: 자동 폼 입력 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                자동 폼 입력
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                등록한 예약 정보를 자동으로 입력하고 제출합니다. 이메일, 이름, 사번, 케이터링 타입을 한 번만 설정하면 됩니다.
              </p>
            </div>

            {/* 기능 3: 실시간 모니터링 */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                실시간 모니터링
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                예약 상태와 이력을 실시간으로 확인할 수 있습니다. 성공/실패 여부를 즉시 알림으로 받아보세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 작동 방식 섹션 */}
      <section className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              작동 방식
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              4단계로 간단하게 시작하세요
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* 단계 1 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  익스텐션 설치
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                크롬 익스텐션을 설치하고 활성화합니다.
              </p>
            </div>

            {/* 단계 2 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  정보 등록
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                예약에 필요한 정보를 한 번만 입력합니다.
              </p>
            </div>

            {/* 단계 3 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  자동 대기
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                오후 3시까지 자동으로 대기합니다.
              </p>
            </div>

            {/* 단계 4 */}
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  예약 완료
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                정확한 시간에 자동으로 예약하고 알림을 받습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs">
              © 2024 Catering. 자동 케이터링 예약 시스템
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
