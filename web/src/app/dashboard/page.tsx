import { AutoReservationStatus } from "@/components/AutoReservationStatus";
import { LogoutButton } from "@/components/LogoutButton";
import { ReservationForm } from "@/components/ReservationForm";
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
            <ReservationForm userEmail={user.email ?? ""} />
          </div>

          {/* 상태 카드 */}
          <div className="grid grid-cols-1 gap-4">
            {/* 자동 예약 상태 */}
            <AutoReservationStatus />

            {/* 사용 방법 안내 */}
            <div className="bg-gray-800 dark:bg-gray-900 rounded-lg border border-gray-700 dark:border-gray-800 p-5">
              <h2 className="text-base font-semibold text-white dark:text-gray-50 mb-4">
                사용 방법
              </h2>
              <div className="space-y-4 text-sm text-gray-200 dark:text-gray-300">
                <div className="space-y-2">
                  <h3 className="font-medium text-white dark:text-gray-50 flex items-start gap-2">
                    <span className="text-blue-400">1.</span>
                    <span>케이터링 사이트 로그인</span>
                  </h3>
                  <p className="pl-6 text-gray-300 dark:text-gray-400">
                    케이터링 예약 사이트에서 구글 로그인을 진행해주세요. 
                    익스텐션이 브라우저를 직접 조작하여 자동으로 예약을 제출해드립니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-white dark:text-gray-50 flex items-start gap-2">
                    <span className="text-blue-400">2.</span>
                    <span>예약 정보 저장</span>
                  </h3>
                  <p className="pl-6 text-gray-300 dark:text-gray-400">
                    이메일, 이름, 사번, 케이터링 시간 정보를 입력한 후 반드시 
                    <span className="font-semibold text-white dark:text-gray-50"> "저장하기"</span> 버튼을 
                    클릭하여 정보를 업데이트해주세요.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-white dark:text-gray-50 flex items-start gap-2">
                    <span className="text-blue-400">3.</span>
                    <span>예약 성공률 및 주의사항</span>
                  </h3>
                  <p className="pl-6 text-gray-300 dark:text-gray-400">
                    평균 <span className="font-semibold text-green-400">4ms 이내</span>로 예약이 성공합니다. 
                    다만 자리가 없는 경우 현재는 수동으로 예약을 진행해주셔야 합니다. 
                    <span className="text-gray-400 dark:text-gray-500">(추후 차순위 예약 기능 도입 예정)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
