# 배치 작업의 HTTP POST 방식 한계 설명

## 🔍 두 가지 방식 비교

### 1. 익스텐션 방식 (현재 작동 중) ✅

**동작 방식:**
```
1. 브라우저에서 실제 페이지 열기
2. 페이지가 완전히 로드될 때까지 대기
3. JavaScript로 DOM 요소 찾기
4. 폼 필드에 값 입력 (실제 사용자처럼)
5. 제출 버튼 클릭
6. 브라우저가 자동으로 폼 제출 처리
```

**장점:**
- ✅ 실제 브라우저 환경에서 실행
- ✅ 세션 쿠키 자동 처리
- ✅ CSRF 토큰 자동 포함
- ✅ JavaScript로 동적 생성되는 폼도 처리 가능
- ✅ 실제 사용자와 동일한 방식

**코드 예시 (익스텐션):**
```typescript
// 1. 페이지 열기
const tab = await chrome.tabs.create({ url: TARGET_URL });

// 2. DOM 요소 찾기
const emailInput = document.querySelector('input[name="email"]');

// 3. 값 입력
emailInput.value = user.email;

// 4. 버튼 클릭
submitButton.click(); // 브라우저가 자동으로 폼 제출
```

---

### 2. 배치 작업 방식 (현재 구현됨) ⚠️

**동작 방식:**
```typescript
// 서버에서 직접 HTTP POST 요청
const response = await fetch(TARGET_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'email=xxx&name=xxx&empNo=xxx&type=01'
});
```

**문제점:**

#### ❌ 문제 1: CSRF 토큰이 필요한 경우
많은 웹사이트는 CSRF(Cross-Site Request Forgery) 공격을 방지하기 위해 토큰을 사용합니다.

**예시:**
```html
<!-- 실제 폼에는 숨겨진 CSRF 토큰이 있음 -->
<form>
  <input type="hidden" name="_csrf" value="abc123xyz789">
  <input name="email" />
  ...
</form>
```

**배치 작업의 문제:**
- CSRF 토큰을 미리 가져와야 함
- 토큰은 페이지를 로드해야만 얻을 수 있음
- 단순 POST 요청으로는 불가능

#### ❌ 문제 2: 세션 쿠키가 필요한 경우
사용자가 로그인해야 하는 경우, 세션 쿠키가 필요합니다.

**예시:**
```
1. 사용자가 로그인 → 서버가 세션 쿠키 발급
2. 이후 모든 요청에 쿠키 포함 필요
3. 배치 작업은 쿠키 없이 요청 → 인증 실패
```

**배치 작업의 문제:**
- 로그인 세션이 없음
- 쿠키를 미리 가져와야 함
- 단순 POST 요청으로는 불가능

#### ❌ 문제 3: JavaScript로 동적 생성되는 폼
React, Vue 등으로 만든 사이트는 JavaScript가 실행되어야 폼이 생성됩니다.

**예시:**
```javascript
// 페이지 로드 후 JavaScript가 폼 생성
useEffect(() => {
  setFormFields([...]); // 동적으로 필드 생성
}, []);
```

**배치 작업의 문제:**
- 단순 HTTP 요청은 HTML만 받음
- JavaScript 실행 결과를 받을 수 없음
- 폼 필드가 없으면 제출 불가능

#### ❌ 문제 4: 폼 검증 로직
많은 사이트는 클라이언트 측 검증을 합니다.

**예시:**
```javascript
// 제출 전 검증
if (!validateForm()) {
  alert('입력값을 확인해주세요');
  return;
}
```

**배치 작업의 문제:**
- 검증 로직을 우회할 수 없음
- 검증 실패 시 제출 불가능

---

## 🎯 실제 타겟 사이트 분석 필요

현재 배치 작업이 작동하는지 확인하려면:

### 확인 사항 1: CSRF 토큰 여부
```bash
# 타겟 사이트의 폼 HTML 확인
curl https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/ | grep -i csrf
```

### 확인 사항 2: 로그인 필요 여부
- 사이트에 접속해서 로그인이 필요한지 확인
- 로그인이 필요하면 배치 작업은 작동하지 않음

### 확인 사항 3: JavaScript 의존성
- 브라우저 개발자 도구에서 JavaScript 비활성화
- 폼이 여전히 보이는지 확인
- JavaScript 없이 작동하지 않으면 배치 작업은 어려움

---

## 💡 해결 방안

### 방안 1: Puppeteer 사용 ❌ (Vercel에서 제한적)

**Puppeteer란?**
- Node.js로 Chrome 브라우저를 제어하는 도구
- 실제 브라우저처럼 동작
- 익스텐션과 동일한 방식

**Vercel에서의 문제:**
- ❌ 실행 시간 제한 (무료: 10초, Pro: 60초)
- ❌ 메모리 제한 (Puppeteer는 수백 MB 필요)
- ❌ Chromium 실행 권한 문제
- ❌ 패키지 크기 제한

**결론: Vercel에서는 Puppeteer 사용이 어렵습니다.**

**대안:**
- 외부 브라우저 서비스 (Browserless.io 등)
- 별도 서버 (Railway, Render 등)
- 또는 현재 HTTP POST 방식 유지

### 방안 2: 외부 브라우저 서비스 활용

**Browserless.io:**
- 무료 티어: 월 6시간
- API로 브라우저 자동화 가능
- Vercel에서 호출 가능

**ScrapingBee:**
- 무료 티어: 월 1,000 요청
- JavaScript 렌더링 지원

### 방안 3: 별도 서버 사용

**Railway:**
- 무료 티어: $5 크레딧/월
- Puppeteer 사용 가능
- Cron Jobs 지원

**Render:**
- 무료 티어: 제한적
- Cron Jobs 지원

### 방안 4: 현재 방식 유지 + 모니터링 (권장) ⭐

**현재 HTTP POST 방식:**
- ✅ 간단하고 빠름
- ✅ Vercel에서 바로 작동
- ✅ 무료
- ⚠️ 작동하지 않을 수 있음
- ✅ 실제 테스트로 확인 필요

**추천 전략:**
1. 일단 현재 방식으로 배포
2. 실제 테스트
3. 작동하면 그대로 사용
4. 실패하면 외부 서비스 고려

---

## 🧪 테스트 방법

### 1. 수동 테스트
```bash
# 배치 작업 API 직접 호출
curl https://your-domain.vercel.app/api/cron/reservation

# 결과 확인
# - 성공: 예약이 실제로 제출되었는지 타겟 사이트에서 확인
# - 실패: 에러 메시지 확인
```

### 2. 로그 확인
- Vercel Functions 로그에서 상세 에러 확인
- `reservation_logs` 테이블에서 실패 메시지 확인

### 3. 타겟 사이트 확인
- 예약이 실제로 들어갔는지 확인
- 실패했다면 어떤 에러가 발생했는지 확인

---

## 📝 결론

**현재 배치 작업의 HTTP POST 방식은:**
- ✅ 간단하고 빠름
- ⚠️ CSRF, 세션, JavaScript 의존성이 있으면 실패할 수 있음
- ✅ 실제 테스트로 확인 필요

**만약 작동하지 않는다면:**
- Puppeteer 사용 고려
- 또는 외부 브라우저 자동화 서비스 활용

**현재는:**
- 일단 배포하고 테스트
- 실패하면 Puppeteer로 전환

