# Katering - 자동 케이터링 예약 시스템

오후 3시 정각에 자동으로 케이터링 예약을 수행하는 크롬 익스텐션 및 관리 웹사이트입니다.

## 🎯 프로젝트 개요

Katering은 특정 시간(오후 3시)에 정확히 예약을 자동으로 수행하는 시스템입니다.

### 주요 기능

- ⏰ 매일 지정된 시간에 자동 예약 실행
- 📝 예약 폼 자동 입력
- 🔔 예약 성공/실패 알림
- 📊 예약 이력 조회

## 🏗️ 시스템 구성

### 1. 크롬 익스텐션 (자동 예약 엔진)
- Manifest V3 기반
- Chrome Alarms API로 정확한 시간 트리거
- DOM 조작으로 폼 자동 입력 및 제출

### 2. 관리 웹사이트
- Next.js 14 (App Router)
- Supabase 인증 (Google OAuth)
- 예약 정보 등록 및 관리

## 🛠️ 기술 스택

| 구성 요소 | 기술 |
|----------|------|
| 크롬 익스텐션 | Manifest V3 + TypeScript + tsup |
| 웹 프론트엔드/백엔드 | Next.js 16 (App Router) + TypeScript |
| 데이터베이스 | Supabase (PostgreSQL) |
| 인증 | Supabase Auth (Google OAuth) |
| 배포 | Vercel (무료) |
| 패키지 관리 | pnpm |

## 📁 프로젝트 구조

```
katering/
├── _docs/                    # 프로젝트 문서
├── _AI_docs/                 # AI 생성 문서
├── extension/                # 크롬 익스텐션
│   ├── src/
│   │   ├── background.ts    # 서비스 워커
│   │   ├── content.ts       # 콘텐츠 스크립트
│   │   └── popup/           # 팝업 UI
│   └── dist/                # 빌드 결과물
└── web/                      # Next.js 관리 웹사이트
    └── src/
        ├── app/              # App Router
        └── lib/              # Supabase 클라이언트
```

## 🚀 시작하기

### 익스텐션 개발

```bash
cd extension
pnpm install
pnpm build
```

### 웹사이트 개발

```bash
cd web
pnpm install
pnpm dev
```

### 환경 변수 설정

`web/.env.local` 파일 생성:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📖 문서

- [프로젝트 상세 문서](_docs/PROJECT.md)
- [테스트 가이드](_AI_docs/QUICK_TEST.md)
- [배포 가이드](_AI_docs/EXTENSION_DEPLOY.md)
- [Git 워크플로우](_AI_docs/GIT_WORKFLOW.md)

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 👤 작성자

개인 사이드 프로젝트

