# Supabase Site URL 설정 문제 해결

## 문제

로컬호스트에서 로그인 성공 시 배포 사이트로 리다이렉트되는 경우, **Supabase의 Redirect URLs 설정**이 원인입니다.

### 증상

- `[LoginModal] Redirect URL: http://localhost:3000/auth/callback...` 로그는 보임
- `[Auth Callback] Request received:` 로그는 안 보임
- `/auth/callback` 엔드포인트가 호출되지 않음
- Supabase가 직접 프로덕션 URL로 리다이렉트함

## 해결 방법

### 1. Supabase Redirect URLs 설정 (필수!)

**핵심**: Supabase는 Redirect URLs에 등록된 URL로만 리다이렉트합니다. localhost가 없으면 프로덕션 URL로만 리다이렉트됩니다.

1. **Supabase 대시보드 접속**

   - https://supabase.com 접속
   - 프로젝트 선택

2. **Authentication → URL Configuration**

   - 왼쪽 메뉴: "Authentication" → "URL Configuration"

3. **Redirect URLs 확인 및 추가**

   - **Redirect URLs** 섹션 확인
   - 다음 두 URL이 **모두** 추가되어 있어야 합니다:
     ```
     http://localhost:3000/auth/callback
     https://your-production-url.com/auth/callback
     ```
   - localhost URL이 없으면 추가 (한 줄씩 입력하고 "Add" 클릭)

4. **Site URL 설정**
   - **Site URL**: `https://your-production-url.com` (프로덕션 URL로 유지)
   - Site URL은 프로덕션으로 설정하되, Redirect URLs에 localhost도 추가하면 됩니다

### 2. 확인 방법

브라우저 개발자 도구에서 다음을 확인하세요:

1. **Network 탭**

   - 로그인 후 `/auth/callback` 요청이 있는지 확인
   - 요청이 없다면 Supabase가 직접 프로덕션 URL로 리다이렉트한 것입니다

2. **Console 탭**

   - `[Auth Callback] Request received:` 로그가 보이는지 확인
   - 로그가 안 보이면 `/auth/callback`이 호출되지 않은 것입니다

3. **Application 탭 → Cookies**
   - Supabase 세션 쿠키가 설정되어 있는지 확인

### 3. 코드 확인

코드는 이미 request URL의 hostname을 확인하도록 수정되었습니다:

- `auth/callback/route.ts`: request URL의 hostname이 `localhost`이면 `http://localhost:3000`으로 리다이렉트
- `LoginModal.tsx`: `window.location.hostname`이 `localhost`이면 `http://localhost:3000`으로 설정

### 4. 디버깅

브라우저 개발자 도구 콘솔에서 다음 로그를 확인하세요:

```
[LoginModal] Redirect URL: http://localhost:3000/auth/callback?next=/dashboard (hostname: localhost)
[Auth Callback] Redirecting to: http://localhost:3000/dashboard (hostname: localhost)
```

만약 다른 URL이 표시된다면:

1. Supabase Site URL 설정 확인
2. Redirect URLs에 localhost URL이 추가되어 있는지 확인
3. 브라우저 캐시 및 쿠키 삭제 후 재시도

## 확인 체크리스트

- [ ] Supabase Site URL이 프로덕션 URL로 설정됨
- [ ] Redirect URLs에 `http://localhost:3000/auth/callback` 추가됨
- [ ] Redirect URLs에 `https://your-production-url.com/auth/callback` 추가됨
- [ ] 브라우저 콘솔에서 올바른 redirect URL이 로그에 표시됨
- [ ] 로컬에서 로그인 시 `http://localhost:3000/dashboard`로 리다이렉트됨
