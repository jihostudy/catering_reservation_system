import { LogoutButton } from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const ALLOWED_DOMAIN = "@oliveyoung.co.kr";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // 이메일 도메인 재검증 (추가 안전장치)
  if (user.email && !user.email.endsWith(ALLOWED_DOMAIN)) {
    await supabase.auth.signOut();
    redirect(
      "/auth/error?message=" +
        encodeURIComponent("올리브영 이메일만 사용 가능합니다.")
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-black">
      {/* 헤더 */}
      <header className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-white dark:text-gray-50">
              Catering
            </h1>
            <p className="text-xs text-gray-300 dark:text-gray-400 mt-0.5">
              자동 예약 관리
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-200 dark:text-gray-300">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* 예약 정보 등록 카드 */}
          <div className="bg-gray-800 dark:bg-gray-900 rounded-lg border border-gray-700 dark:border-gray-800 p-5">
            <h2 className="text-base font-semibold text-white dark:text-gray-50 mb-4">
              예약 정보
            </h2>
            <form className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-200 dark:text-gray-300 mb-1.5">
                  이메일
                </label>
                <input
                  type="email"
                  defaultValue={user.email ?? ""}
                  readOnly
                  className="w-full px-3 py-2 text-sm border border-gray-700 dark:border-gray-800 rounded-md bg-gray-700 dark:bg-gray-800 text-gray-200 dark:text-gray-300 cursor-default"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-200 dark:text-gray-300 mb-1.5">
                    이름
                  </label>
                  <input
                    type="text"
                    placeholder="홍길동"
                    className="w-full px-3 py-2 text-sm border border-gray-700 dark:border-gray-800 rounded-md bg-gray-700 dark:bg-gray-800 text-white dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 hover:border-gray-600 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-200 dark:text-gray-300 mb-1.5">
                    사번
                  </label>
                  <input
                    type="text"
                    placeholder="800000"
                    className="w-full px-3 py-2 text-sm border border-gray-700 dark:border-gray-800 rounded-md bg-gray-700 dark:bg-gray-800 text-white dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 hover:border-gray-600 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-text"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-200 dark:text-gray-300 mb-1.5">
                  케이터링 타입
                </label>
                <select className="w-full px-3 py-2 text-sm border border-gray-700 dark:border-gray-800 rounded-md bg-gray-700 dark:bg-gray-800 text-white dark:text-gray-100 hover:border-gray-600 dark:hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors cursor-pointer">
                  <option value="">선택하세요</option>
                  <option value="1차수">1차수 (11:30~12:00)</option>
                  <option value="2차수">2차수 (12:00~12:30)</option>
                  <option value="3차수">3차수 (12:30~13:00)</option>
                  <option value="콤보">콤보 (11:30~15:00)</option>
                  <option value="샐러드">샐러드 (11:30~15:00)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
              >
                저장하기
              </button>
            </form>
          </div>

          {/* 상태 및 이력 카드 */}
          <div className="grid grid-cols-1 gap-4">
            {/* 자동 예약 상태 */}
            <div className="bg-gray-800 dark:bg-gray-900 rounded-lg border border-gray-700 dark:border-gray-800 p-5">
              <h2 className="text-base font-semibold text-white dark:text-gray-50 mb-3">
                자동 예약 상태
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-200 dark:text-gray-300">
                  비활성화
                </span>
              </div>
              <p className="text-xs text-gray-300 dark:text-gray-400 leading-relaxed">
                크롬 익스텐션을 설치하고 예약 정보를 등록하면 자동 예약이
                활성화됩니다.
              </p>
            </div>

            {/* 최근 예약 이력 */}
            <div className="bg-gray-800 dark:bg-gray-900 rounded-lg border border-gray-700 dark:border-gray-800 p-5">
              <h2 className="text-base font-semibold text-white dark:text-gray-50 mb-3">
                최근 예약 이력
              </h2>
              <div className="text-center py-4">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  아직 예약 이력이 없습니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
