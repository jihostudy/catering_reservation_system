# 올리브영 자동 케이터링 예약 시스템

오후 3시 정각에 자동으로 케이터링 예약을 수행하는 Chrome Extension 및 관리 웹사이트입니다.

> 💡 이 프로젝트는 바이브 코딩으로 제작되었습니다.

---

## 1. 프로젝트 개요

올리브영 자동 케이터링 예약 시스템은 매일 오후 3시 정각에 자동으로 케이터링 예약을 시도하는 시스템입니다. 사용자는 한 번만 예약 정보를 등록하면, 이후 자동으로 예약이 진행됩니다.

### 핵심 가치

- ⏰ **정확한 시간 예약**: 밀리초 단위의 정확한 타이밍으로 예약 성공률 극대화
- 🔄 **자동 재시도**: 1차수 자리 없음 시 2차수, 3차수로 자동 재시도
- 🎯 **완전 자동화**: 수동 개입 없이 백그라운드에서 자동 실행
- 🔔 **실시간 알림**: 예약 성공/실패 시 즉시 알림 제공

### 대상 사용자

- 올리브영 직원 (`@oliveyoung.co.kr` 이메일만 사용 가능)
- 매일 케이터링 예약이 필요한 사용자

---

## 2. 설치 방법

### 3.1 사용자용: Extension 설치하기

**중요**: 웹 애플리케이션은 이미 배포되어 있습니다. Extension만 설치하면 바로 사용할 수 있습니다.

#### 방법 1: Chrome Web Store에서 설치 (권장)

1. Chrome Web Store에서 "Catering Auto Reservation" 검색
2. "추가하기" 버튼 클릭하여 설치
3. 설치 완료 후 익스텐션 아이콘 클릭하여 확인

#### 방법 2: 개발자 모드로 설치 (직접 빌드)

1. **저장소 클론**

   ```bash
   git clone https://github.com/jihostudy/catering_reservation_system.git
   cd catering_reservation_system/extension
   ```

2. **의존성 설치 및 빌드**

   ```bash
   pnpm install
   pnpm build
   ```

3. **Chrome에 익스텐션 로드**

   - Chrome 브라우저에서 `chrome://extensions/` 접속
   - 우측 상단 **"개발자 모드"** 활성화
   - **"압축해제된 확장 프로그램을 로드합니다"** 클릭
   - `extension` 폴더 선택

4. **사용 시작**
   - 익스텐션 아이콘 클릭하여 팝업 확인
   - **"로그인하기"** 버튼 클릭 → 배포된 웹사이트로 이동
   - Google 로그인 (올리브영 이메일만 가능)
   - 대시보드에서 예약 정보 입력 및 저장
   - 익스텐션 팝업에서 정보 확인 및 자동 예약 활성화

### 3.2 사용 방법

1. **로그인**

   - 익스텐션 팝업에서 "로그인하기" 클릭
   - 또는 직접 https://cateringreservationsystem.vercel.app 접속하여 로그인

2. **예약 정보 등록**

   - 대시보드(https://cateringreservationsystem.vercel.app/dashboard) 접속
   - 이름, 사번, 케이터링 타입 입력
   - "저장하기" 클릭

3. **자동 예약 활성화**

   - 익스텐션 팝업에서 "자동 예약" 토글 스위치 ON
   - 매일 오후 3시 정각에 자동으로 예약 실행

4. **예약 상태 확인**
   - 익스텐션 팝업에서 예약 정보 및 상태 확인
   - 예약 성공/실패 시 알림 표시

---

## 3. 주요 기능

### 3.1 자동 예약 실행

- **정확한 시간 실행**: 매일 오후 3시 정각에 자동 실행
- **백그라운드 실행**: 사용자 방해 없이 백그라운드에서 실행
- **자동 폼 입력**: 등록한 정보(이메일, 이름, 사번, 케이터링 타입) 자동 입력
- **자동 제출**: 폼 입력 후 자동으로 제출 버튼 클릭

### 3.2 스마트 재시도 시스템

- **자동 차수 변경**: 1차수 자리 없음 → 즉시 2차수 시도 → 3차수 시도
- **즉시 재시도**: 페이지 새로고침 없이 폼만 업데이트하여 빠른 재시도
- **재시도 제한**: 콤보/샐러드는 재시도 없음, 차수 타입만 재시도

### 3.3 예약 상태 관리

- **오늘 예약 확인**: 이미 예약한 경우 자동으로 스킵
- **실패 처리**: 예약 실패 시 적절한 알림 및 다음 날 재시도
- **히스토리 저장**: 최근 30개 예약 결과 저장 (익스텐션 로컬 스토리지)

### 3.4 사용자 인터페이스

- **웹 대시보드**: 예약 정보 등록 및 관리
- **익스텐션 팝업**: 예약 상태 확인 및 자동 예약 토글
- **실시간 동기화**: 웹 대시보드와 익스텐션 간 데이터 자동 동기화

### 3.5 보안 및 인증

- **Google OAuth 로그인**: Supabase를 통한 Google OAuth 인증
- **이메일 도메인 제한**: 올리브영 이메일(`@oliveyoung.co.kr`)만 사용 가능
- **자동 로그아웃**: 허용되지 않은 이메일로 로그인 시 자동 로그아웃

---

## 4. 시스템 구성

### 4.1 아키텍처 개요

```
┌─────────────────────────────────────┐
│         사용자 브라우저              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Chrome Extension           │ │
│  │  (로컬 설치, 배포된 웹과 통신)  │ │
│  └───────────┬───────────────────┘ │
│              │                      │
│  ┌───────────▼───────────────────┐ │
│  │  배포된 웹 애플리케이션         │ │
│  │  (Vercel)                     │ │
│  │  https://cateringreservations │ │
│  │  ystem.vercel.app             │ │
│  └───────────┬───────────────────┘ │
└──────────────┼─────────────────────┘
               │
          ┌────▼────┐
          │ Supabase│ (개발자 계정)
          │         │
          │ ┌─────┐ │
          │ │Auth │ │ (Google OAuth)
          │ └─────┘ │
          │ ┌─────┐ │
          │ │  DB │ │ (PostgreSQL)
          │ └─────┘ │
          └─────────┘
```

**중요**:

- Extension은 사용자가 설치하는 클라이언트입니다
- 웹 애플리케이션은 이미 배포되어 있어 사용자가 별도 설정할 필요 없습니다
- Supabase는 개발자 계정을 사용하므로 사용자는 설정할 필요 없습니다

### 4.2 구성 요소

#### 4.2.1 Chrome Extension

**역할**: 자동 예약 실행 엔진

**주요 파일**:

- `src/background.ts`: Service Worker, 알람 관리, 예약 실행 트리거
- `src/content.ts`: 타겟 페이지 폼 자동 입력 및 제출
- `src/dashboard-content.ts`: 대시보드 페이지에서 사용자 정보 추출 및 동기화
- `src/popup/popup.js`: 익스텐션 팝업 UI 및 상태 표시

**기술 스택**:

- Manifest V3
- TypeScript
- Chrome APIs (Alarms, Storage, Tabs, Notifications)

**주요 기능**:

- Chrome Alarms API로 매일 오후 3시 알람 설정
- 백그라운드에서 타겟 페이지 열기
- Content Script로 폼 자동 입력 및 제출
- 예약 결과 감지 및 알림 표시
- 자동 재시도 로직 (1차수 → 2차수 → 3차수)

#### 4.2.2 웹 애플리케이션

**역할**: 사용자 인터페이스 및 데이터 관리

**주요 파일**:

- `src/app/page.tsx`: 메인 랜딩 페이지
- `src/app/dashboard/page.tsx`: 예약 정보 관리 대시보드
- `src/components/ReservationForm.tsx`: 예약 정보 입력 폼
- `src/app/api/users/route.ts`: 사용자 프로필 API

**기술 스택**:

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase SSR

**주요 기능**:

- Google OAuth 로그인
- 예약 정보 등록 및 수정
- 자동 예약 활성화/비활성화
- 실시간 데이터 동기화

#### 4.2.3 Supabase

**역할**: 백엔드 서비스 (인증 및 데이터베이스)

**주요 구성**:

- **Authentication**: Google OAuth 인증
- **Database**: PostgreSQL
  - `profiles` 테이블: 사용자 프로필 정보
    - `id`: UUID (auth.users 참조)
    - `email`: 이메일
    - `name`: 이름
    - `employee_id`: 사번
    - `catering_type`: 케이터링 타입 (1차수, 2차수, 3차수, 콤보, 샐러드)
    - `enabled`: 자동 예약 활성화 여부
    - `created_at`, `updated_at`: 타임스탬프

**보안**:

- Row Level Security (RLS) 활성화
- 사용자는 자신의 프로필만 조회/수정 가능

### 4.3 데이터 흐름

#### 예약 정보 등록 흐름

```
1. 사용자가 배포된 웹 대시보드에서 정보 입력
   (https://cateringreservationsystem.vercel.app/dashboard)
   ↓
2. PUT /api/users API 호출 (배포된 웹사이트)
   ↓
3. Supabase profiles 테이블에 저장 (개발자 계정)
   ↓
4. dashboard-content.js가 폼 변경 감지
   ↓
5. Chrome Storage에 동기화 (사용자 로컬)
   ↓
6. 익스텐션 팝업에서 정보 표시
```

#### 자동 예약 실행 흐름

```
1. Chrome Alarms API가 오후 3시에 알람 트리거
   ↓
2. background.ts의 onAlarm 리스너 실행
   ↓
3. Chrome Storage에서 예약 정보 읽기
   ↓
4. 백그라운드에서 타겟 페이지 열기 (active: false)
   ↓
5. content.ts가 페이지 로드 감지
   ↓
6. 폼 자동 입력 및 제출
   ↓
7. 예약 결과 감지 (성공/실패/자리 없음)
   ↓
8. 자리 없음이면 다음 차수로 즉시 재시도
   ↓
9. 최종 결과를 background.ts로 전송
   ↓
10. 알림 표시 및 결과 저장
```

### 4.4 기술 스택 요약

| 구성 요소            | 기술          | 버전   |
| -------------------- | ------------- | ------ |
| **Chrome Extension** | Manifest V3   | -      |
|                      | TypeScript    | 5.9.3  |
|                      | tsup          | 8.5.0  |
| **웹 애플리케이션**  | Next.js       | 16.1.1 |
|                      | React         | 19.2.3 |
|                      | TypeScript    | 5.x    |
|                      | Tailwind CSS  | 4.x    |
| **백엔드**           | Supabase      | -      |
|                      | PostgreSQL    | -      |
| **인증**             | Supabase Auth | -      |
|                      | Google OAuth  | -      |
| **배포**             | Vercel        | -      |
| **패키지 관리**      | pnpm          | -      |

### 4.5 프로젝트 구조

```
catering_reservation_system/
├── extension/                 # Chrome Extension
│   ├── src/
│   │   ├── background.ts      # Service Worker (알람, 예약 실행)
│   │   ├── content.ts         # 타겟 페이지 폼 자동 입력
│   │   ├── dashboard-content.ts  # 대시보드 동기화
│   │   ├── types.ts           # TypeScript 타입 정의
│   │   └── popup/             # 팝업 UI
│   │       ├── popup.html
│   │       └── popup.js
│   ├── dist/                  # 빌드 결과물
│   ├── public/                # 아이콘 등 정적 파일
│   ├── manifest.json          # 익스텐션 매니페스트
│   └── package.json
│
├── web/                       # Next.js 웹 애플리케이션
│   ├── src/
│   │   ├── app/               # App Router
│   │   │   ├── page.tsx       # 메인 페이지
│   │   │   ├── dashboard/     # 대시보드 페이지
│   │   │   ├── auth/          # 인증 관련
│   │   │   └── api/           # API 라우트
│   │   ├── components/        # React 컴포넌트
│   │   └── lib/               # 유틸리티 (Supabase 클라이언트)
│   ├── supabase/
│   │   └── migrations/        # 데이터베이스 마이그레이션
│   └── package.json
│
├── _docs/                     # 프로젝트 문서
├── _AI_docs/                  # AI 생성 문서
└── README.md                  # 이 파일
```

---

## 📚 추가 문서

- [환경 변수 설정 가이드](web/_docs/ENV_VARIABLES_GUIDE.md)
- [Supabase 리디렉션 URL 설정](web/_docs/SUPABASE_REDIRECT_URL_SETUP.md)
- [Google OAuth 설정](_AI_docs/GOOGLE_OAUTH_SETUP.md)
- [익스텐션 배포 가이드](extension/DEPLOY.md)
- [디버깅 가이드](extension/DEBUG_GUIDE.md)
