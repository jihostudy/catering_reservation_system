'use client';

import { useState, useEffect } from 'react';

interface ReservationLog {
  id: string;
  success: boolean;
  message: string | null;
  executed_at: string;
}

export function ReservationHistory() {
  const [logs, setLogs] = useState<ReservationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await fetch('/api/reservation-logs');
        if (response.ok) {
          const data = await response.json();
          setLogs(data.logs || []);
        }
      } catch (error) {
        console.error('Failed to load reservation history:', error);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800 dark:bg-gray-900 rounded-lg border border-gray-700 dark:border-gray-800 p-5">
        <h2 className="text-base font-semibold text-white dark:text-gray-50 mb-3">
          최근 예약 이력
        </h2>
        <div className="text-center py-4">
          <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-600 animate-pulse mx-auto"></div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
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
    );
  }

  return (
    <div className="bg-gray-800 dark:bg-gray-900 rounded-lg border border-gray-700 dark:border-gray-800 p-5">
      <h2 className="text-base font-semibold text-white dark:text-gray-50 mb-3">
        최근 예약 이력
      </h2>
      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start justify-between gap-3 p-3 bg-gray-700 dark:bg-gray-800 rounded-md border border-gray-600 dark:border-gray-700"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    log.success
                      ? 'bg-green-500 dark:bg-green-400'
                      : 'bg-red-500 dark:bg-red-400'
                  }`}
                ></div>
                <span
                  className={`text-xs font-medium ${
                    log.success
                      ? 'text-green-400 dark:text-green-300'
                      : 'text-red-400 dark:text-red-300'
                  }`}
                >
                  {log.success ? '성공' : '실패'}
                </span>
              </div>
              {log.message && (
                <p className="text-xs text-gray-300 dark:text-gray-400 mt-1">
                  {log.message}
                </p>
              )}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
              {new Date(log.executed_at).toLocaleString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

