# Google OAuth 설정 가이드 (회사 GCP 불필요)

## ✅ 좋은 소식: 회사 GCP 접근 불필요!

Supabase Auth를 사용하면 **개인 Google Cloud Console**에서 OAuth 앱을 만들면 됩니다. 회사 GCP에 접근할 필요가 전혀 없습니다!

## 🚀 설정 방법

### 1단계: 개인 Google Cloud Console에서 OAuth 앱 생성

1. **Google Cloud Console 접속**

   - https://console.cloud.google.com/ 접속
   - 개인 Google 계정으로 로그인

2. **새 프로젝트 생성** (또는 기존 프로젝트 사용)

   - 프로젝트 선택 → 새 프로젝트
   - 프로젝트 이름: `Catering` (또는 원하는 이름)

3. **OAuth 동의 화면 설정**

   - 왼쪽 메뉴: "API 및 서비스" → "OAuth 동의 화면"
   - 사용자 유형: **외부** 선택
   - 앱 이름: `Catering`
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일
   - 저장 후 계속

4. **OAuth 2.0 클라이언트 ID 생성**

   - 왼쪽 메뉴: "API 및 서비스" → "사용자 인증 정보"
   - 상단 "+ 사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
   - 애플리케이션 유형: **웹 애플리케이션**
   - 이름: `Catering Web`
   - 승인된 리디렉션 URI 추가:
     ```
     https://[YOUR_SUPABASE_PROJECT].supabase.co/auth/v1/callback
     ```
     - `[YOUR_SUPABASE_PROJECT]`는 Supabase 프로젝트 URL의 일부
     - 예: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
   - 만들기 클릭

5. **클라이언트 ID와 Secret 복사**
   - 생성된 클라이언트 ID와 클라이언트 보안 비밀번호 복사
   - 나중에 Supabase에 등록할 때 사용

### 2단계: Supabase에서 Google OAuth 활성화

1. **Supabase 프로젝트 접속**

   - https://supabase.com 접속
   - 프로젝트 선택

2. **인증 설정**

   - 왼쪽 메뉴: "Authentication" → "Providers"
   - "Google" 찾아서 활성화

3. **Google OAuth 정보 입력**

   - Client ID (for OAuth): 1단계에서 복사한 클라이언트 ID
   - Client Secret (for OAuth): 1단계에서 복사한 클라이언트 Secret
   - 저장

4. **Redirect URL 확인**
   - Supabase가 자동으로 생성한 Redirect URL 확인
   - 이 URL을 Google Cloud Console의 "승인된 리디렉션 URI"에 추가했는지 확인

### 3단계: 이메일 도메인 제한 (선택사항)

현재 코드에는 `hd=oliveyoung.co.kr` 파라미터가 있지만, 완벽한 제한은 아닙니다.

**더 강력한 제한 방법:**

1. **Supabase에서 이메일 도메인 제한**

   - Supabase Dashboard → Authentication → Policies
   - 커스텐 정책으로 `@oliveyoung.co.kr` 도메인만 허용

2. **코드에서 이중 검증** (이미 구현됨)
   - OAuth 콜백에서 이메일 검증
   - 대시보드 접근 시 재검증

## 📝 중요 참고사항

### Google OAuth의 도메인 제한 한계

- `hd=oliveyoung.co.kr` 파라미터는 **힌트**일 뿐, 강제하지 않음
- 사용자가 다른 Google 계정을 선택할 수 있음
- 따라서 **코드에서 이메일 검증이 필수** (이미 구현됨)

### 대안 방법 (Google OAuth가 불가능한 경우)

만약 Google OAuth 설정이 정말 불가능하다면:

1. **Supabase 이메일/비밀번호 인증**

   - 사용자가 직접 회원가입
   - 이메일 도메인 검증 후 가입 허용

2. **Magic Link 인증**

   - 이메일로 로그인 링크 전송
   - 도메인 검증 후 링크 발송

3. **커스텀 인증**
   - 간단한 토큰 기반 인증
   - 이메일 도메인 검증

## 🔧 현재 코드 상태

현재 구현된 기능:

- ✅ Google OAuth 로그인 UI
- ✅ OAuth 콜백에서 이메일 도메인 검증
- ✅ 대시보드 접근 시 재검증
- ✅ 허용되지 않은 도메인 자동 로그아웃

**추가로 필요한 것:**

- Supabase 프로젝트 생성
- Google Cloud Console에서 OAuth 앱 생성
- Supabase에 OAuth 정보 등록

## 🎯 빠른 시작 체크리스트

- [ ] Google Cloud Console에서 프로젝트 생성
- [ ] OAuth 동의 화면 설정
- [ ] OAuth 클라이언트 ID 생성
- [ ] Supabase 프로젝트 생성
- [ ] Supabase에서 Google OAuth 활성화
- [ ] 클라이언트 ID/Secret 등록
- [ ] Redirect URI 확인 및 설정
- [ ] 테스트 로그인

## 💡 팁

1. **개인 Google 계정으로 충분합니다**

   - 회사 GCP 접근 불필요
   - 무료로 사용 가능

2. **Supabase 무료 티어로 시작 가능**

   - 500MB DB
   - 1GB 스토리지
   - 충분한 인증 요청

3. **로컬 개발 시**
   - `http://localhost:3000/auth/callback`도 Redirect URI에 추가
   - 개발/프로덕션 환경 분리

## ❓ 문제 해결

### "리디렉션 URI 불일치" 오류

- Google Cloud Console의 Redirect URI와 Supabase의 콜백 URL이 정확히 일치해야 함
- Supabase 콜백 URL: `https://[project].supabase.co/auth/v1/callback`

### "도메인 제한이 작동하지 않음"

- `hd` 파라미터는 힌트일 뿐
- 코드에서 이메일 검증이 필수 (이미 구현됨)

### "Supabase에서 Google OAuth가 보이지 않음"

- Supabase 프로젝트가 활성화되어 있는지 확인
- 프로젝트 설정에서 인증 기능이 활성화되어 있는지 확인
