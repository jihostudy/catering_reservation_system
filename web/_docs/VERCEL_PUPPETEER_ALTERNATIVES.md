# Vercel에서 Puppeteer 대안

## ❌ Vercel에서 Puppeteer 사용의 문제점

### 1. 실행 시간 제한

- **무료 플랜**: 최대 10초
- **Pro 플랜**: 최대 60초
- Puppeteer는 브라우저를 실행하는데만 수 초 소요
- 실제 작업 시간이 부족할 수 있음

### 2. 메모리 제한

- Puppeteer + Chromium은 **수백 MB** 메모리 필요
- Vercel 서버리스 함수는 메모리 제한이 있음
- 메모리 부족으로 실패할 수 있음

### 3. Chromium 실행 문제

- Vercel 서버리스 환경에서 Chromium 실행 권한 부족
- 특정 버전의 Chromium을 찾지 못하는 문제
- 커뮤니티에서도 보고된 이슈

### 4. 패키지 크기 제한

- Puppeteer + Chromium은 매우 큼 (수백 MB)
- Vercel의 배포 크기 제한 초과 가능

---

## ✅ 대안 방안

### 방안 1: 현재 HTTP POST 방식 유지 (권장) ⭐

**장점:**

- ✅ Vercel에서 바로 작동
- ✅ 빠르고 가벼움
- ✅ 무료
- ✅ 간단한 폼이면 충분히 작동

**단점:**

- ⚠️ CSRF 토큰, 세션, JavaScript 의존성이 있으면 실패

**현재 상태:**

- 이미 구현되어 있음
- 일단 배포하고 테스트해보기
- 작동하면 그대로 사용

**테스트 방법:**

```bash
# 배치 작업 수동 실행
curl https://your-domain.vercel.app/api/cron/reservation

# 결과 확인
# - reservation_logs 테이블에서 확인
# - 타겟 사이트에서 실제 예약 확인
```

---

### 방안 2: 외부 브라우저 서비스 활용

#### Browserless.io

- **무료 티어**: 월 6시간
- **유료**: $75/월부터
- API로 브라우저 자동화 가능

**구현 예시:**

```typescript
const response = await fetch(
  "https://chrome.browserless.io/content?token=YOUR_TOKEN",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: TARGET_URL,
      code: `
      await page.type('input[name="email"]', '${user.email}');
      await page.type('input[name="name"]', '${user.name}');
      await page.select('select[name="type"]', '${mappedType}');
      await page.click('button[type="submit"]');
      await page.waitForNavigation();
    `,
    }),
  }
);
```

**단점:**

- 무료 티어는 제한적
- 유료면 비용 발생

#### ScrapingBee

- **무료 티어**: 월 1,000 요청
- **유료**: $49/월부터
- JavaScript 렌더링 지원

---

### 방안 3: 별도 서버 사용 (무료 옵션)

#### Railway

- **무료 티어**: $5 크레딧/월
- Puppeteer 사용 가능
- 별도 서버 필요

**구조:**

```
Vercel (웹사이트)
  ↓ API 호출
Railway (배치 작업 서버)
  ↓ Puppeteer 실행
타겟 사이트
```

#### Render

- **무료 티어**: 제한적
- Cron Jobs 지원
- Puppeteer 사용 가능

---

### 방안 4: Vercel + Puppeteer-core + 외부 브라우저

**puppeteer-core** 사용:

- Chromium 없이 Puppeteer 사용
- 외부 브라우저 서비스 연결

**구현:**

```typescript
import puppeteer from "puppeteer-core";

const browser = await puppeteer.connect({
  browserWSEndpoint: "wss://chrome.browserless.io?token=YOUR_TOKEN",
});
```

**단점:**

- 여전히 외부 서비스 필요 (유료 가능성)

---

## 🎯 추천 전략

### 1단계: 현재 방식 테스트 (지금)

```
현재 HTTP POST 방식으로 배포
→ 실제 테스트
→ 작동하면 ✅ 완료
→ 실패하면 2단계로
```

### 2단계: 타겟 사이트 분석

```
타겟 사이트가:
- CSRF 토큰 필요? → 외부 서비스 필요
- 세션 쿠키 필요? → 외부 서비스 필요
- JavaScript 의존? → 외부 서비스 필요
- 단순 폼? → 현재 방식으로 가능
```

### 3단계: 필요시 대안 선택

```
옵션 A: Browserless.io (무료 티어 시도)
옵션 B: Railway 별도 서버 (무료 크레딧)
옵션 C: 익스텐션만 사용 (이미 작동 중)
```

---

## 💡 현실적인 접근

### 현재 상황

1. ✅ 익스텐션은 이미 작동 중 (Chrome이 열려있을 때)
2. ✅ 배치 작업은 HTTP POST 방식으로 구현됨
3. ⚠️ 배치 작업이 작동하는지 아직 모름

### 권장 사항

1. **일단 배포하고 테스트**

   - 현재 방식으로 배포
   - 실제로 예약이 되는지 확인
   - 작동하면 그대로 사용

2. **실패하면**

   - 타겟 사이트 분석
   - Browserless.io 무료 티어 시도
   - 또는 Railway 별도 서버 구축

3. **최악의 경우**
   - 익스텐션만 사용 (이미 작동 중)
   - 사용자가 Chrome을 열어두면 자동 예약

---

## 📝 결론

**Vercel에서 Puppeteer는 사용하기 어렵습니다.**

**하지만:**

- 현재 HTTP POST 방식이 작동할 수도 있음
- 일단 테스트해보고 실패하면 대안 고려
- 익스텐션은 이미 작동 중이므로 최소한의 기능은 보장됨

**다음 단계:**

1. 현재 방식으로 배포
2. 실제 테스트
3. 결과에 따라 대안 선택
