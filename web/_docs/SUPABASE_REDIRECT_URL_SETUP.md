# Supabase OAuth 리다이렉트 URL 설정 가이드

## 현재 코드 상태

코드는 이미 자동으로 처리됩니다:
- `LoginModal.tsx`: `window.location.origin` 사용 → 현재 도메인 자동 감지
- `auth/callback/route.ts`: `origin` 변수 사용 → 현재 도메인 자동 감지

**하지만 Supabase와 Google Cloud Console 설정이 필요합니다.**

---

## 1. Supabase 리다이렉트 URL 설정

### Supabase 대시보드에서 확인

1. **Supabase 대시보드 접속**
   - https://supabase.com 접속
   - 프로젝트 선택

2. **Authentication → URL Configuration**
   - 왼쪽 메뉴: "Authentication" → "URL Configuration"
   - **"Redirect URLs"** 섹션 확인

3. **프로덕션 URL 추가**
   ```
   https://cateringreservationsystem.vercel.app/auth/callback
   ```

4. **개발 URL도 유지** (로컬 개발용)
   ```
   http://localhost:3000/auth/callback
   ```

### Site URL 설정

- **Site URL**: `https://cateringreservationsystem.vercel.app`
- **Redirect URLs**: 위의 두 URL 모두 추가

---

## 2. Google Cloud Console 리다이렉트 URI 설정

### Google Cloud Console에서 설정

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com/ 접속
   - 프로젝트 선택

2. **API 및 서비스 → 사용자 인증 정보**
   - 왼쪽 메뉴: "API 및 서비스" → "사용자 인증 정보"
   - OAuth 2.0 클라이언트 ID 클릭

3. **승인된 리디렉션 URI에 추가**

   **Supabase 콜백 URL:**
   ```
   https://[YOUR_SUPABASE_PROJECT].supabase.co/auth/v1/callback
   ```
   - `[YOUR_SUPABASE_PROJECT]`는 Supabase 프로젝트 URL의 일부
   - 예: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`

   **참고**: 
   - Supabase가 자동으로 Google OAuth를 처리하므로
   - 직접 웹사이트 URL을 추가할 필요는 없습니다
   - Supabase 콜백 URL만 추가하면 됩니다

---

## 3. 확인 방법

### 로그인 테스트

1. **프로덕션 사이트에서 로그인**
   - https://cateringreservationsystem.vercel.app 접속
   - 로그인 버튼 클릭
   - Google 로그인 후 리다이렉트 확인

2. **리다이렉트 URL 확인**
   - 로그인 후 URL이 `https://cateringreservationsystem.vercel.app/dashboard`인지 확인
   - `localhost:3000`으로 리다이렉트되지 않아야 함

### 에러 확인

만약 리다이렉트 오류가 발생하면:

1. **Supabase 대시보드 확인**
   - Authentication → URL Configuration
   - Redirect URLs에 프로덕션 URL이 있는지 확인

2. **브라우저 콘솔 확인**
   - 개발자 도구 → Console
   - OAuth 관련 에러 메시지 확인

---

## 4. 환경별 설정 요약

### 개발 환경 (localhost:3000)
- Supabase Redirect URLs: `http://localhost:3000/auth/callback`
- Google OAuth: Supabase 콜백 URL만 필요

### 프로덕션 환경 (cateringreservationsystem.vercel.app)
- Supabase Redirect URLs: `https://cateringreservationsystem.vercel.app/auth/callback`
- Google OAuth: Supabase 콜백 URL만 필요 (동일)

---

## 5. 중요 참고사항

### Supabase가 OAuth를 처리

- 실제 OAuth 흐름:
  1. 사용자가 "Google로 로그인" 클릭
  2. Google 로그인 페이지로 이동
  3. Google 인증 후 → **Supabase 콜백 URL로 리다이렉트**
  4. Supabase가 처리 후 → **웹사이트 `/auth/callback`로 리다이렉트**
  5. 웹사이트가 처리 후 → **`/dashboard`로 리다이렉트**

- 따라서 Google Cloud Console에는:
  - ✅ Supabase 콜백 URL만 추가하면 됨
  - ❌ 웹사이트 URL을 직접 추가할 필요 없음

### 코드는 자동 처리

- `window.location.origin` 사용 → 현재 도메인 자동 감지
- 개발/프로덕션 환경 자동 구분
- 별도 환경 변수 불필요

---

## 6. 문제 해결

### "리디렉션 URI 불일치" 오류

**원인**: Supabase Redirect URLs에 프로덕션 URL이 없음

**해결**:
1. Supabase 대시보드 → Authentication → URL Configuration
2. Redirect URLs에 `https://cateringreservationsystem.vercel.app/auth/callback` 추가

### localhost로 리다이렉트되는 문제

**원인**: Supabase Site URL이 localhost로 설정됨

**해결**:
1. Supabase 대시보드 → Authentication → URL Configuration
2. Site URL을 `https://cateringreservationsystem.vercel.app`로 변경
3. Redirect URLs에 프로덕션 URL 추가

### Google OAuth 오류

**원인**: Google Cloud Console에 Supabase 콜백 URL이 없음

**해결**:
1. Google Cloud Console → API 및 서비스 → 사용자 인증 정보
2. OAuth 클라이언트 ID 클릭
3. 승인된 리디렉션 URI에 Supabase 콜백 URL 추가

