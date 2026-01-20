# 올리브영 자동 케이터링 예약 시스템

오후 3시 정각에 자동으로 케이터링 예약을 수행하는 Chrome Extension 및 관리 웹사이트입니다.

> 🚨 15:00 에 브라우저가 꼭 켜져 있어야 합니다!! 이 시스템을 전적으로 믿지 말아주세요.. 🚨


> 💡 이 프로젝트는 바이브 코딩으로 제작되었습니다.


## 1. 설치 방법

### 1.1 Extension 설치하기

**중요**: 웹 애플리케이션은 이미 배포되어 있습니다. Extension만 설치하면 바로 사용할 수 있습니다.

#### 방법 1: GitHub Releases에서 설치 (권장)

1. **릴리즈 페이지 접속**

   - [GitHub Releases](https://github.com/jihostudy/catering_reservation_system/releases) 페이지로 이동
   - 최신 릴리즈의 `catering-extension-v*.zip` 파일 다운로드

2. **ZIP 파일 압축 해제**

   - 다운로드한 ZIP 파일을 원하는 위치에 압축 해제

3. **Chrome에 익스텐션 로드**
   - Chrome 브라우저에서 `chrome://extensions/` 접속
   - 우측 상단 **"개발자 모드"** 활성화
   - **"압축해제된 확장 프로그램을 로드합니다"** 클릭
   - 압축 해제한 폴더 선택

4. [홈페이지](https://cateringreservationsystem.vercel.app/)에 접속하여 데이터 수정
(예시)
<img width="600" height="500" alt="image" src="https://github.com/user-attachments/assets/fda00171-1374-432e-90a5-90f9024b36a7" />



5. 크롬 익스텐션에 정보가 제대로 입력되었는지 확인
<img width="357" height="313" alt="image" src="https://github.com/user-attachments/assets/82282030-2605-4382-b3ba-cbaf7315c858" />




> 💡 **업데이트 방법**: 새 버전이 릴리즈되면 기존 익스텐션을 제거하고 새 버전을 다시 설치하세요.

#### 방법 2: (준비중, 사용 불가) Chrome Web Store에서 설치

1. Chrome Web Store에서 "Catering Auto Reservation" 검색
2. "추가하기" 버튼 클릭하여 설치
3. 설치 완료 후 익스텐션 아이콘 클릭하여 확인

#### 방법 3: 개발자 모드로 설치 (직접 빌드)

1. **저장소 클론**

   ```bash
   git clone https://github.com/jihostudy/catering_reservation_system.git
   cd catering_reservation_system/extension
   ```

2. **의존성 설치, 빌드 및 ZIP 파일 생성**

   ```bash
   pnpm install
   pnpm build
   pnpm package
   ```

3. **Chrome에 익스텐션 로드**

   - Chrome 브라우저에서 `chrome://extensions/` 접속
   - 우측 상단 **"개발자 모드"** 활성화
   - **"압축해제된 확장 프로그램을 로드합니다"** 클릭
   - `extension` 폴더 선택 (또는 ZIP 파일을 압축 해제한 폴더)

### 1.2 사용 방법

1. **로그인**

   - 익스텐션 팝업에서 "로그인하기" 클릭
   - 또는 직접 https://cateringreservationsystem.vercel.app 접속하여 로그인

2. **예약 정보 등록**

   - 대시보드(https://cateringreservationsystem.vercel.app/dashboard) 접속
   - 이름, 사번, 케이터링 타입 입력
   - "저장하기" 클릭



## 2. 프로젝트 개요

올리브영 자동 케이터링 예약 시스템은 매일 오후 3시 정각에 자동으로 케이터링 예약을 시도하는 시스템입니다. 사용자는 한 번만 예약 정보를 등록하면, 이후 자동으로 예약이 진행됩니다.

### 핵심 가치

- ⏰ **정확한 시간 예약**: 밀리초 단위의 정확한 타이밍으로 예약 성공률 극대화
- 🎯 **완전 자동화**: 매일 오후 3시 정각에 자동으로 예약 실행
- 🔔 **실시간 알림**: 예약 성공/실패 시 즉시 데스크탑 알림 제공
- 🔐 **안전한 인증**: Google OAuth를 통한 안전한 로그인

### 대상 사용자

- 올리브영 직원 (`@oliveyoung.co.kr` 이메일만 사용 가능)
- 매일 케이터링 예약이 필요한 사용자


## 3. 주요 기능

### 3.1 자동 예약 실행

- **정확한 시간 실행**: 매일 오후 3시 정각에 자동 실행
- **백그라운드 실행**: 사용자 방해 없이 백그라운드에서 실행
- **자동 폼 입력**: 등록한 정보(이메일, 이름, 사번, 케이터링 타입) 자동 입력
- **자동 제출**: 폼 입력 후 자동으로 제출 버튼 클릭

### 3.2 (추후 도입) 스마트 재시도 시스템

- **자동 차수 변경**: 1차수 자리 없음 → 즉시 2차수 시도 → 3차수 시도
- **즉시 재시도**: 페이지 새로고침 없이 폼만 업데이트하여 빠른 재시도
- **재시도 제한**: 콤보/샐러드는 재시도 없음, 차수 타입만 재시도

### 3.3 (추후 도입) 예약 상태 관리

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


## 4. 시스템 구성

### 4.1 아키텍처 개요

```
┌─────────────────────────────────────┐
│         사용자 브라우저              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Chrome Extension                                                                     │ │
│  │  (로컬 설치, 배포된 웹과 통신)                                                         │ │
│  └───────────┬───────────────────┘ │
│              │                      │
│  ┌───────────▼───────────────────┐ │
│  │  배포된 웹 애플리케이션                                                                 │ │
│  └───────────┬───────────────────┘ │
└─────────────┼────────────────────┘
               │
          ┌────▼────┐
          │ Supabase│ (개발자 계정)
          │         │
          │ ┌─────┐ │
          │ │Auth         │ │ (Google OAuth)
          │ └─────┘ │
          │ ┌─────┐ │
          │ │  DB          │ │ (PostgreSQL)
          │ └─────┘ │
          └─────────┘
```

### 4.2 구성 요소

#### 4.2.1 Chrome Extension

**역할**: 자동 예약 실행 엔진

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

**보안**:

- Row Level Security (RLS) 활성화
- 사용자는 자신의 프로필만 조회/수정 가능

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
