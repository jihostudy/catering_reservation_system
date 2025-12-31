'use client';

import { useState, createContext, useContext } from 'react';
import { LoginModal } from './LoginModal';

// 모달 상태를 전역으로 관리하기 위한 Context
const LoginModalContext = createContext<{
  openModal: () => void;
  closeModal: () => void;
} | null>(null);

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal must be used within LoginModalProvider');
  }
  return context;
}

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <LoginModalContext.Provider
      value={{
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
      }}
    >
      {children}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </LoginModalContext.Provider>
  );
}

interface LoginButtonProps {
  variant?: 'primary' | 'secondary';
}

export function LoginButton({ variant = 'primary' }: LoginButtonProps) {
  const { openModal } = useLoginModal();

  const baseClasses = 'inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer';
  
  const variantClasses = variant === 'primary'
    ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
    : 'bg-white text-blue-600 hover:bg-gray-50 active:bg-gray-100';

  return (
    <button
      onClick={openModal}
      className={`${baseClasses} ${variantClasses}`}
    >
      로그인하기
    </button>
  );
}

