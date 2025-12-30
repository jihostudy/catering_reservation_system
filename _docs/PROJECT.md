# Catering - 자동 예약 시스템

## 프로젝트 개요

Catering은 특정 시간(오후 3시)에 정확히 예약을 자동으로 수행하는 시스템입니다.

### 타겟 사이트

- URL: `https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/`

## 시스템 구성

### 1. 크롬 익스텐션 (자동 예약 엔진)

- **목적**: 지정된 시간에 자동으로 예약 폼을 제출
- **핵심 기능**:
  - 정확한 시간(3시) 대기 및 실행
  - 예약 폼 자동 입력
  - 신청하기 버튼 자동 클릭
  - 예약 성공/실패 알림

### 2. 관리 웹사이트

- **목적**: 예약 정보 등록 및 관리
- **핵심 기능**:
  - 회사 구글 이메일로 로그인되어야 자동 시스템 등록 가능
  - 사용자 예약 정보 등록 (이메일, 이름, 사번, 케이터링 타입)
  - 자동 예약 이력 조회
  - 예약 상태 모니터링

## 기술 스택 (100% 무료 배포)

### 크롬 익스텐션

- Manifest V3
- TypeScript
- Chrome Storage API (예약 정보 저장)
- Chrome Alarms API (정확한 시간 트리거)
- 배포: Chrome Web Store (등록비 $5 일회성) 또는 수동 설치

### 관리 웹사이트

- **Frontend + Backend**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **인증**: Supabase Auth (Google OAuth)
- **배포**: Vercel

### 무료 티어 한도

| 서비스 | 무료 한도 | 비고 |
|--------|----------|------|
| **Vercel** | 100GB 대역폭/월, 10만 서버리스 호출 | 영구 무료 |
| **Supabase** | 500MB DB, 1GB 스토리지, 2개 프로젝트 | 영구 무료 (비활성 시 일시정지) |
| **Google OAuth** | 무제한 | 무료 |

### 왜 이 스택인가?

1. **Vercel + Next.js**: 프론트엔드와 API를 한 곳에서 무료 배포
2. **Supabase**: PostgreSQL + 인증 + 실시간 DB를 한 번에 제공, Firebase 대안
3. **Google OAuth**: 회사 이메일 도메인 제한 가능 (예: `@company.com`만 허용)

## 프로젝트 구조

```
catering/
├── _docs/                    # 프로젝트 문서
│   ├── PROJECT.md           # 이 파일
│   └── AI_PROMPT.md         # AI 개발 지원 프롬프트
├── extension/               # 크롬 익스텐션
│   ├── manifest.json
│   ├── src/
│   │   ├── background.ts    # 서비스 워커 (시간 트리거)
│   │   ├── content.ts       # 콘텐츠 스크립트 (폼 조작)
│   │   └── popup/           # 팝업 UI
│   └── dist/                # 빌드 결과물
└── web/                     # Next.js 관리 웹사이트
    ├── src/
    │   ├── app/             # App Router
    │   │   ├── api/         # API Routes
    │   │   ├── dashboard/   # 대시보드 페이지
    │   │   └── auth/        # 인증 관련
    │   ├── components/      # React 컴포넌트
    │   └── lib/             # Supabase 클라이언트 등
    ├── supabase/            # DB 마이그레이션
    └── package.json
```

## 핵심 로직

### 자동 예약 플로우

1. 사용자가 관리 웹사이트에서 예약 정보 등록
2. 크롬 익스텐션이 예약 정보 동기화
3. 예약 시간(3시) 직전에 타겟 페이지 자동 열기
4. 정확히 3시에 폼 자동 입력 및 제출
5. 결과 확인 및 알림

### 시간 정확도 보장

- `Date.now()` 기반 밀리초 단위 타이밍
- 서버 시간 동기화 (NTP)
- 네트워크 지연 보정

## 개발 시 주의사항

1. **타겟 사이트 분석 필요**

   - 폼 필드 ID/Name 확인
   - 제출 버튼 선택자 확인
   - CAPTCHA 여부 확인
   - Rate limiting 정책 확인

2. **법적 고려사항**
   - 사이트 이용약관 준수
   - 과도한 요청 방지

## TODO

- [ ] 타겟 사이트 HTML 구조 분석
- [ ] 크롬 익스텐션 기본 구조 세팅
- [ ] 관리 웹사이트 기본 구조 세팅
- [ ] 자동 입력 스크립트 개발
- [ ] 시간 동기화 로직 구현
- [ ] 테스트 및 배포
