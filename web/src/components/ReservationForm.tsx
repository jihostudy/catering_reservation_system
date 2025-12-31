'use client';

import { useState, useEffect } from 'react';
import { Toast } from './Toast';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  employee_id: string | null;
  catering_type: string | null;
}

interface ReservationFormProps {
  userEmail: string;
}

export function ReservationForm({ userEmail }: ReservationFormProps) {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [cateringType, setCateringType] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState({
    name: false,
    employeeId: false,
    cateringType: false,
  });

  // 저장된 사용자 정보 불러오기
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data: UserProfile = await response.json();
          if (data.name) setName(data.name);
          if (data.employee_id) setEmployeeId(data.employee_id);
          if (data.catering_type) setCateringType(data.catering_type);
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    }
    loadUserProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // 필수 필드 검증
    const trimmedName = name.trim();
    const trimmedEmployeeId = employeeId.trim();

    const newErrors = {
      name: !trimmedName,
      employeeId: !trimmedEmployeeId,
      cateringType: !cateringType,
    };

    setErrors(newErrors);

    // 하나라도 에러가 있으면 저장 중단
    if (newErrors.name || newErrors.employeeId || newErrors.cateringType) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          employee_id: trimmedEmployeeId,
          catering_type: cateringType,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '저장되었습니다!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || '저장에 실패했습니다.' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <label className="block text-xs font-medium text-gray-200 dark:text-gray-300 mb-1.5">
          이메일
        </label>
        <input
          type="email"
          value={userEmail}
          readOnly
          disabled
          className="w-full px-3 py-2 text-sm border border-gray-700 dark:border-gray-800 rounded-md bg-gray-700/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${
            errors.name 
              ? 'text-red-400 dark:text-red-500' 
              : 'text-gray-200 dark:text-gray-300'
          }`}>
            이름
          </label>
          <input
            type="text"
            placeholder="홍길동"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors(prev => ({ ...prev, name: false }));
              }
            }}
            className={`w-full px-3 py-2 text-sm border rounded-md bg-gray-700 dark:bg-gray-800 text-white dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors cursor-text ${
              errors.name
                ? 'border-red-500 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-700 dark:border-gray-800 hover:border-gray-600 dark:hover:border-gray-700 focus:ring-blue-500 focus:border-transparent'
            }`}
          />
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${
            errors.employeeId 
              ? 'text-red-400 dark:text-red-500' 
              : 'text-gray-200 dark:text-gray-300'
          }`}>
            사번
          </label>
          <input
            type="text"
            placeholder="800000"
            value={employeeId}
            onChange={(e) => {
              setEmployeeId(e.target.value);
              if (errors.employeeId) {
                setErrors(prev => ({ ...prev, employeeId: false }));
              }
            }}
            className={`w-full px-3 py-2 text-sm border rounded-md bg-gray-700 dark:bg-gray-800 text-white dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors cursor-text ${
              errors.employeeId
                ? 'border-red-500 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-700 dark:border-gray-800 hover:border-gray-600 dark:hover:border-gray-700 focus:ring-blue-500 focus:border-transparent'
            }`}
          />
        </div>
      </div>
      <div>
        <label className={`block text-xs font-medium mb-1.5 ${
          errors.cateringType 
            ? 'text-red-400 dark:text-red-500' 
            : 'text-gray-200 dark:text-gray-300'
        }`}>
          케이터링 타입
        </label>
        <select
          value={cateringType}
          onChange={(e) => {
            setCateringType(e.target.value);
            if (errors.cateringType) {
              setErrors(prev => ({ ...prev, cateringType: false }));
            }
          }}
          className={`w-full px-3 py-2 text-sm border rounded-md bg-gray-700 dark:bg-gray-800 text-white dark:text-gray-100 focus:outline-none focus:ring-2 transition-colors cursor-pointer ${
            errors.cateringType
              ? 'border-red-500 dark:border-red-600 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-700 dark:border-gray-800 hover:border-gray-600 dark:hover:border-gray-700 focus:ring-blue-500 focus:border-transparent'
          }`}
        >
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
        disabled={loading || !name.trim() || !employeeId.trim() || !cateringType}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '저장 중...' : '저장하기'}
      </button>

      {/* 토스트 팝업 */}
      <Toast
        message={message?.text || ''}
        type={message?.type || 'success'}
        isOpen={!!message}
        onClose={() => setMessage(null)}
      />
    </form>
  );
}

