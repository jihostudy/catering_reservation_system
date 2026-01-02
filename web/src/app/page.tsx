"use client";

import { ErrorHandler } from "@/components/ErrorHandler";
import { LoginButton } from "@/components/LoginButton";
import { Header } from "@/components/Header";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <ErrorHandler />
      </Suspense>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black relative overflow-hidden pt-16">
        {/* 배경 애니메이션 요소 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-300/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* 히어로 섹션 */}
        <section className="min-h-screen flex items-center justify-center relative py-20 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center">
              {/* 로고/브랜드 */}
              <div className="mb-6 animate-fade-in">
                <div className="mb-2">
                  <span className="inline-block text-sm sm:text-base font-semibold text-green-600 dark:text-green-400 tracking-wide px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 animate-fade-in-up">
                    올리브영
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 animate-fade-in-up delay-100">
                  자동 케이터링 예약 시스템
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 animate-fade-in-up delay-200">
                  오후 3시 정각 자동 예약으로 편리하게
                </p>
              </div>

              {/* 핵심 메시지 */}
              <div className="max-w-3xl mx-auto mb-8 animate-fade-in-up delay-300">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white mb-4 leading-tight">
                  올리브영 케이터링 예약,
                  <br />
                  <span className="text-green-600 dark:text-green-400 inline-block animate-bounce-subtle">
                    자동으로
                  </span>{" "}
                  간편하게
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  설정만 하면 오후 3시 정각에 자동으로 예약이 완료됩니다.
                </p>
              </div>

              {/* CTA 버튼 */}
              <div className="flex flex-col gap-3 justify-center items-center animate-fade-in-up delay-400">
                <div className="transform hover:scale-105 transition-transform duration-300">
                  <LoginButton />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 animate-fade-in">
                  @oliveyoung.co.kr 이메일만 사용 가능합니다
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 주요 기능 섹션 */}
        <section className="bg-white dark:bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                올리브영 케이터링 예약의 모든 것
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                간편하고 정확한 자동 예약 시스템
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 기능 1: 정확한 시간 예약 */}
              <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400 animate-spin-slow"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  정확한 시간 예약
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  오후 3시 정각에 자동으로 실행됩니다. 밀리초 단위의 정확한
                  타이밍으로 케이터링 예약 성공률을 극대화합니다.
                </p>
              </div>

              {/* 기능 2: 자동 폼 입력 */}
              <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  자동 폼 입력
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  예약 정보를 자동으로 입력하고 제출합니다. 이메일, 이름, 사번,
                  케이터링 타입을 한 번만 설정하면 됩니다.
                </p>
              </div>

              {/* 기능 3: 실시간 알림 */}
              <div className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:shadow-green-500/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  실시간 알림
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  예약 상태와 이력을 실시간으로 확인할 수 있습니다. 성공/실패
                  여부를 즉시 알림으로 받아보세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 작동 방식 섹션 */}
        <section className="bg-gray-50 dark:bg-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                올리브영 케이터링 예약, 이렇게 간단합니다
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                3단계로 간단하게 시작하세요
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-16 max-w-5xl mx-auto">
              {/* 단계 1 */}
              <div className="group flex flex-col items-center text-center cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white rounded-full flex items-center justify-center font-bold text-3xl mb-4 shadow-xl shadow-green-500/30 group-hover:shadow-2xl group-hover:shadow-green-500/50 transition-all duration-300 group-hover:scale-110 ring-4 ring-green-500/20 group-hover:ring-green-400/40 animate-float">
                    1
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"></div>
                  <div className="absolute inset-0 rounded-full bg-green-400/20 scale-150 group-hover:scale-175 group-hover:bg-green-400/30 transition-all duration-500 animate-ping"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  익스텐션 설치
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  크롬 익스텐션을 설치하고 활성화합니다.
                </p>
              </div>

              {/* 단계 2 */}
              <div className="group flex flex-col items-center text-center cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div
                    className="w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white rounded-full flex items-center justify-center font-bold text-3xl mb-4 shadow-xl shadow-green-500/30 group-hover:shadow-2xl group-hover:shadow-green-500/50 transition-all duration-300 group-hover:scale-110 ring-4 ring-green-500/20 group-hover:ring-green-400/40 animate-float"
                    style={{ animationDelay: "0.3s" }}
                  >
                    2
                  </div>
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full bg-green-400/20 scale-150 group-hover:scale-175 group-hover:bg-green-400/30 transition-all duration-500 animate-ping"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  정보 등록
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  예약에 필요한 정보를 한 번만 입력합니다.
                </p>
              </div>

              {/* 단계 3 */}
              <div className="group flex flex-col items-center text-center cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="relative">
                  <div
                    className="w-24 h-24 bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white rounded-full flex items-center justify-center font-bold text-3xl mb-4 shadow-xl shadow-green-500/30 group-hover:shadow-2xl group-hover:shadow-green-500/50 transition-all duration-300 group-hover:scale-110 ring-4 ring-green-500/20 group-hover:ring-green-400/40 animate-float"
                    style={{ animationDelay: "0.6s" }}
                  >
                    3
                  </div>
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse group-hover:scale-125 transition-transform"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full bg-green-400/20 scale-150 group-hover:scale-175 group-hover:bg-green-400/30 transition-all duration-500 animate-ping"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  예약 완료
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  정확한 시간에 예약을 자동으로 완료하고 알림을 받습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 푸터 */}
        <footer className="bg-gray-900 dark:bg-black text-gray-400 py-4 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-xs">
                © 2024 올리브영 자동 케이터링 예약 시스템
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
