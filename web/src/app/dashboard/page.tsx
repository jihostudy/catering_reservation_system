import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Katering Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 예약 정보 등록 카드 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">예약 정보 등록</h2>
            <p className="text-gray-600 text-sm mb-4">
              자동 예약에 사용할 정보를 등록하세요.
            </p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  defaultValue={user.email ?? ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름
                </label>
                <input
                  type="text"
                  placeholder="홍길동"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사번
                </label>
                <input
                  type="text"
                  placeholder="EMP001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  케이터링 타입
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                저장하기
              </button>
            </form>
          </div>

          {/* 상태 카드 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">자동 예약 상태</h2>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                <span className="text-gray-600">비활성화</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                크롬 익스텐션을 설치하고 예약 정보를 등록하면 자동 예약이 활성화됩니다.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">최근 예약 이력</h2>
              <p className="text-gray-500 text-sm">아직 예약 이력이 없습니다.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
