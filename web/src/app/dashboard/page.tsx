import { LogoutButton } from "@/components/LogoutButton";
import { ReservationForm } from "@/components/ReservationForm";
import { AutoReservationStatus } from "@/components/AutoReservationStatus";
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
          </div>
        </div>
      </main>
    </div>
  );
}
