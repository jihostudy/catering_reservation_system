'use client';

import { useState, useEffect } from 'react';

interface UserProfile {
  enabled: boolean | null;
}

export function AutoReservationStatus() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data: UserProfile = await response.json();
          setEnabled(data.enabled ?? false);
        }
      } catch (error) {
        console.error('Failed to load reservation status:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  const handleToggle = async () => {
    if (enabled === null || updating) return;

    const newEnabled = !enabled;
    setUpdating(true);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: newEnabled,
        }),
      });

      if (response.ok) {
        setEnabled(newEnabled);
      } else {
        const error = await response.json();
        console.error('Failed to update status:', error);
        alert('상태 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('상태 업데이트 중 오류가 발생했습니다.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 dark:bg-gray-900 rounded-lg border border-gray-700 dark:border-gray-800 p-5">
        <h2 className="text-base font-semibold text-white dark:text-gray-50 mb-3">
          자동 예약 상태
        </h2>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-600 animate-pulse"></div>
          <span className="text-sm text-gray-200 dark:text-gray-300">로딩 중...</span>
        </div>
      </div>
    );
  }

  const isEnabled = enabled === true;

  return (
    <div className="bg-gray-800 dark:bg-gray-900 rounded-lg border border-gray-700 dark:border-gray-800 p-5">
      {/* 제목과 설명을 한 줄에 */}
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-1">
          <h2 className="text-base font-semibold text-white dark:text-gray-50 flex-shrink-0">
            자동 예약 상태
          </h2>
          {isEnabled && (
            <span className="text-xs text-gray-300 dark:text-gray-400">
              자동 예약이 활성화되어 있습니다. 설정된 시간에 자동으로 예약이 진행됩니다.
            </span>
          )}
        </div>
        
        {/* 토글 스위치 */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={updating}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex-shrink-0 ${
            isEnabled
              ? 'bg-green-500 dark:bg-green-400'
              : 'bg-gray-600 dark:bg-gray-700'
          } ${updating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          aria-label={isEnabled ? '비활성화' : '활성화'}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
              isEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      
      {/* 상태 표시 (비활성화일 때만 표시) */}
      {!isEnabled && (
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full flex-shrink-0 ${
              isEnabled
                ? 'bg-green-500 dark:bg-green-400'
                : 'bg-gray-500 dark:bg-gray-600'
            }`}
          ></div>
          <span className="text-sm text-gray-200 dark:text-gray-300">
            비활성화
          </span>
          <span className="text-xs text-gray-300 dark:text-gray-400 ml-2">
            크롬 익스텐션을 설치하고 예약 정보를 등록하면 자동 예약이 활성화됩니다.
          </span>
        </div>
      )}
    </div>
  );
}

