# 환경 변수 설정 가이드

## 필수 환경 변수 2개

웹 애플리케이션을 위해 Vercel에 다음 2개의 환경 변수를 설정해야 합니다.

---

## 📋 전체 환경 변수 목록

### 웹 애플리케이션 필수

1. `NEXT_PUBLIC_SUPABASE_URL` - ✅ **필수**
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` - ✅ **필수**

### 사용되지 않음

3. `ALLOWED_EMAIL_DOMAIN` - ❌ **불필요** (코드에서 하드코딩됨)

---

## 1. `NEXT_PUBLIC_SUPABASE_URL` ✅ 필수

### 무엇인가?

- Supabase 프로젝트의 공개 URL입니다.
- 데이터베이스와 인증 서비스에 접근하기 위한 기본 주소입니다.

### 어떤 값을 넣어야 하나?

- Supabase 대시보드에서 확인할 수 있습니다.

### 값 가져오는 방법

1. **Supabase 대시보드 접속**

   - https://supabase.com 접속
   - 로그인 후 프로젝트 선택

2. **Settings → API 메뉴로 이동**

   - 왼쪽 사이드바에서 "Settings" 클릭
   - "API" 메뉴 클릭

3. **Project URL 복사**

   - "Project URL" 섹션에서 URL 복사
   - 형식: `https://xxxxxxxxxxxxx.supabase.co`
   - 예시: `https://abcdefghijklmnop.supabase.co`

4. **Vercel에 등록**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   ```

### 주의사항

- `https://` 포함해서 전체 URL을 입력해야 합니다.
- 마지막에 `/` (슬래시)는 붙이지 않습니다.

---

## 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅ 필수

### 무엇인가?

- Supabase의 **익명(anon) 키**입니다.
- 일반 사용자 인증/로그인에 사용됩니다.
- RLS(Row Level Security) 정책이 적용됩니다.

### 어떤 값을 넣어야 하나?

- Supabase 대시보드의 API 설정에서 확인할 수 있습니다.

### 값 가져오는 방법

1. **Supabase 대시보드 접속**

   - https://supabase.com 접속
   - 프로젝트 선택

2. **Settings → API 메뉴로 이동**

   - 왼쪽 사이드바에서 "Settings" 클릭
   - "API" 메뉴 클릭

3. **anon public 키 복사**

   - "Project API keys" 섹션에서 찾기
   - **"anon" "public"** 라벨이 있는 키 찾기
   - 키 전체를 복사
   - 형식: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT 토큰 형태)

4. **Vercel에 등록**
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMn0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 주의사항

- 이 키는 클라이언트(브라우저)에서도 사용되므로 공개되어도 상대적으로 안전합니다.
- 하지만 RLS 정책이 제대로 설정되어 있어야 합니다.

---

## Vercel에 환경 변수 등록하는 방법

### 1. Vercel 대시보드 접속

- https://vercel.com 접속
- 프로젝트 선택

### 2. Settings → Environment Variables

- 프로젝트 설정에서 "Settings" 클릭
- 왼쪽 메뉴에서 "Environment Variables" 클릭

### 3. 환경 변수 추가

각 환경 변수를 하나씩 추가:

1. **Name**: `NEXT_PUBLIC_SUPABASE_URL`

   - **Value**: Supabase 프로젝트 URL
   - **Environment**: Production, Preview, Development 모두 선택
   - "Add" 클릭

2. **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

   - **Value**: Supabase anon 키
   - **Environment**: Production, Preview, Development 모두 선택
   - "Add" 클릭

### 4. 재배포

- 환경 변수를 추가한 후 **프로젝트를 재배포**해야 합니다.
- "Deployments" 탭에서 최신 배포를 "Redeploy" 하거나
- Git에 푸시하면 자동으로 재배포됩니다.

---

## 환경 변수 확인 방법

### Vercel Functions 로그에서 확인

1. Vercel 대시보드 → 프로젝트 → "Functions" 탭
2. API 함수 로그 확인
3. 환경 변수가 제대로 로드되었는지 확인

---

## 문제 해결

### "Missing Supabase environment variables" 오류

- 환경 변수가 제대로 설정되었는지 확인
- 재배포가 완료되었는지 확인
- 변수 이름에 오타가 없는지 확인 (대소문자 구분)

---

---

## 5. `ALLOWED_EMAIL_DOMAIN` ❌ 불필요

### 왜 불필요한가?

- 코드에서 하드코딩되어 있습니다.
- `web/src/app/dashboard/page.tsx`: `const ALLOWED_DOMAIN = "@oliveyoung.co.kr";`
- `web/src/components/LoginModal.tsx`: `const ALLOWED_DOMAIN = "@oliveyoung.co.kr";`
- `web/src/app/auth/callback/route.ts`: `const ALLOWED_DOMAIN = "@oliveyoung.co.kr";`

### 결론

- **이 환경 변수는 등록할 필요가 없습니다.**
- 코드에서 직접 `"@oliveyoung.co.kr"`로 하드코딩되어 있습니다.

---

## 요약 체크리스트

### 필수 환경 변수 (2개)

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Supabase 프로젝트 URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon 키 (로그인/인증용)

### 불필요한 환경 변수

- [ ] `ALLOWED_EMAIL_DOMAIN` - ❌ 등록 불필요 (코드에서 하드코딩됨)

### 배포

- [ ] Vercel 대시보드에 2개 환경 변수 모두 등록
- [ ] 프로젝트 재배포
