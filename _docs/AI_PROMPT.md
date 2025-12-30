# AI 개발 지원 프롬프트

> 이 문서를 AI에게 전달하여 프로젝트 컨텍스트를 제공하세요.

## AI 지침

- 만들어야 하는 Docs가 있으면 `_AI_docs/` 폴더에 `.md` 파일로 생성, 간단한 작업에는 생성하지 말고 꼭 설명이 필요한 작업에만 만들기
- 분석 시 10년차 이상 풀스택 시니어 개발자 관점에서 SOTA 급 분석
- 모든 변수명, 함수명은 의미있는 이름으로 작명 (find, map 등에서 `x`, `item` 같은 무의미한 이름 금지)

---

## 프로젝트 정보

**프로젝트명**: Catering
**목적**: 특정 사이트의 오후 3시 자동 예약 시스템

### 타겟 사이트

```
https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/
```

---

## 기술 스택 (100% 무료)

| 구성 요소            | 기술                                 |
| -------------------- | ------------------------------------ |
| 웹 프론트엔드/백엔드 | Next.js 16 (App Router) + TypeScript |
| 데이터베이스         | Supabase (PostgreSQL)                |
| 인증                 | Supabase Auth (Google OAuth)         |
| 크롬 익스텐션        | Manifest V3 + TypeScript + tsup      |
| 배포                 | Vercel (무료)                        |
| 패키지 관리          | pnpm                                 |

---

## 프로젝트 구조

```
catering/
├── _docs/                         # 프로젝트 문서
│   ├── PROJECT.md                # 상세 프로젝트 문서
│   └── AI_PROMPT.md              # 이 파일
├── extension/                     # 크롬 익스텐션
│   ├── manifest.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsup.config.ts
│   ├── src/
│   │   ├── types.ts              # 타입 정의
│   │   ├── background.ts         # 서비스 워커 (알람, 메시지)
│   │   ├── content.ts            # 콘텐츠 스크립트 (폼 자동 입력)
│   │   └── popup/                # 팝업 UI
│   │       ├── popup.html
│   │       └── popup.js
│   ├── dist/                     # 빌드 결과물
│   └── public/icons/             # 아이콘
└── web/                          # Next.js 관리 웹사이트
    ├── src/
    │   ├── app/
    │   │   ├── auth/
    │   │   │   ├── login/        # 로그인 페이지
    │   │   │   ├── callback/     # OAuth 콜백
    │   │   │   └── error/        # 에러 페이지
    │   │   └── dashboard/        # 대시보드
    │   ├── components/           # React 컴포넌트
    │   └── lib/
    │       └── supabase/         # Supabase 클라이언트
    │           ├── client.ts     # 브라우저용
    │           ├── server.ts     # 서버용
    │           └── middleware.ts # 미들웨어용
    ├── middleware.ts             # Next.js 미들웨어
    ├── .env.local.example        # 환경변수 예시
    └── package.json
```

---

## 주요 파일 설명

### 익스텐션

| 파일            | 역할                                                  |
| --------------- | ----------------------------------------------------- |
| `background.ts` | Chrome Alarms API로 3시 트리거, 메시지 핸들링         |
| `content.ts`    | DOM 조작으로 폼 자동 입력 및 제출                     |
| `types.ts`      | `ReservationData`, `ReservationSchedule` 등 타입 정의 |

### 웹

| 파일                     | 역할                                             |
| ------------------------ | ------------------------------------------------ |
| `lib/supabase/*.ts`      | Supabase SSR 클라이언트 (브라우저/서버/미들웨어) |
| `middleware.ts`          | 인증 체크 및 세션 갱신                           |
| `auth/callback/route.ts` | Google OAuth 콜백 처리                           |
| `dashboard/page.tsx`     | 예약 정보 등록 UI                                |

---

## 개발 명령어

```bash
# 웹 개발 서버
cd web && pnpm dev

# 익스텐션 빌드
cd extension && pnpm build

# 익스텐션 개발 모드 (watch)
cd extension && pnpm watch
```

---

## 다음 단계

1. [ ] Supabase 프로젝트 생성 및 `.env.local` 설정
2. [ ] Supabase에서 Google OAuth 활성화
3. [ ] 타겟 사이트 폼 구조 분석 후 `content.ts` 선택자 업데이트
4. [ ] 예약 데이터 저장용 Supabase 테이블 생성
5. [ ] 웹-익스텐션 데이터 동기화 API 구현
6. [ ] 익스텐션 아이콘 제작
