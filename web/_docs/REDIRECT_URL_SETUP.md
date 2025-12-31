# 리다이렉트 URL 환경별 설정 가이드

## 개요

로그인 성공 시 리다이렉트 URL이 환경에 따라 자동으로 설정됩니다:
- **로컬 환경**: `http://localhost:3000`
- **프로덕션 환경**: 환경 변수 또는 자동 감지

## 동작 방식

### 1. 로컬 환경 (localhost)

- `window.location.hostname`이 `localhost` 또는 `127.0.0.1`인 경우
- 자동으로 `http://localhost:3000`으로 리다이렉트

### 2. 프로덕션 환경

다음 순서로 리다이렉트 URL을 결정합니다:

1. **환경 변수 `NEXT_PUBLIC_SITE_URL`** (우선순위 1)
   - 명시적으로 프로덕션 URL을 설정할 수 있음
   - 예: `https://cateringreservationsystem.vercel.app`

2. **Vercel 자동 환경 변수 `VERCEL_URL`** (우선순위 2)
   - Vercel이 자동으로 제공하는 환경 변수
   - 예: `https://your-project.vercel.app`

3. **`x-forwarded-host` 헤더** (우선순위 3)
   - 프록시/로드밸런서에서 전달하는 호스트 정보

4. **현재 origin** (우선순위 4)
   - `window.location.origin` 사용

## 환경 변수 설정

### Vercel에 환경 변수 추가 (선택사항)

프로덕션 URL을 명시적으로 설정하려면:

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - 프로젝트 선택

2. **Settings → Environment Variables**
   - "Environment Variables" 메뉴 클릭

3. **환경 변수 추가**
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: 프로덕션 URL (예: `https://cateringreservationsystem.vercel.app`)
   - **Environment**: Production만 선택 (또는 Preview, Development도 선택)
   - "Add" 클릭

4. **재배포**
   - 환경 변수 추가 후 프로젝트 재배포

### 로컬 환경 변수 (선택사항)

로컬에서도 환경 변수를 설정하려면 `web/.env.local` 파일에 추가:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

하지만 로컬 환경에서는 자동으로 `localhost:3000`을 사용하므로 설정할 필요가 없습니다.

## 코드 위치

### 1. OAuth 콜백 처리
- 파일: `web/src/app/auth/callback/route.ts`
- 로그인 성공 후 리다이렉트 처리

### 2. 로그인 모달
- 파일: `web/src/components/LoginModal.tsx`
- OAuth 리다이렉트 URL 설정

## 테스트

### 로컬 환경 테스트
1. `pnpm dev`로 로컬 서버 실행
2. 로그인 버튼 클릭
3. Google 로그인 완료 후 `http://localhost:3000/dashboard`로 리다이렉트되는지 확인

### 프로덕션 환경 테스트
1. Vercel에 배포
2. 프로덕션 URL에서 로그인 버튼 클릭
3. Google 로그인 완료 후 프로덕션 URL의 `/dashboard`로 리다이렉트되는지 확인

## 문제 해결

### 로컬에서 프로덕션 URL로 리다이렉트되는 경우
- `window.location.hostname`이 `localhost`가 아닌지 확인
- 브라우저 개발자 도구에서 `window.location.hostname` 값 확인

### 프로덕션에서 localhost로 리다이렉트되는 경우
- `NEXT_PUBLIC_SITE_URL` 환경 변수가 설정되어 있는지 확인
- Vercel 대시보드에서 환경 변수 확인
- 재배포가 완료되었는지 확인

### Supabase 리다이렉트 URL 설정
Supabase 대시보드에서도 리다이렉트 URL을 등록해야 합니다:

1. **Supabase 대시보드 접속**
2. **Authentication → URL Configuration**
3. **Redirect URLs**에 다음 추가:
   - `http://localhost:3000/auth/callback`
   - `https://your-production-url.com/auth/callback`

자세한 내용은 [SUPABASE_REDIRECT_URL_SETUP.md](./SUPABASE_REDIRECT_URL_SETUP.md)를 참고하세요.

