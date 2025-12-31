# 데이터 초기화 가이드

## 1. Chrome Extension Storage 초기화

### 방법 1: Background Script 콘솔에서 초기화 (추천)

1. `chrome://extensions/` 페이지로 이동
2. "Catering Auto Reservation" 익스텐션의 **"service worker"** 링크 클릭
3. 개발자 도구 Console 탭에서 다음 코드 실행:

```javascript
// 모든 Storage 데이터 삭제
await chrome.storage.local.clear();

// 알람도 모두 삭제
await chrome.alarms.clearAll();

// 기본값으로 재설정
const defaultSchedule = {
  enabled: false,
  targetHour: 15,
  targetMinute: 0,
  reservationData: null
};

await chrome.storage.local.set({ 
  schedule: defaultSchedule, 
  history: [],
  lastResult: null,
  testMode: false,
  pendingReservation: null
});

console.log('✅ Extension Storage 초기화 완료!');
```

### 방법 2: 익스텐션 재설치

1. `chrome://extensions/` 페이지로 이동
2. "Catering Auto Reservation" 익스텐션의 **제거** 버튼 클릭
3. 다시 "압축해제된 확장 프로그램을 로드합니다"로 설치

## 2. Supabase 데이터 초기화

### 방법 1: Supabase 대시보드에서 삭제

1. Supabase 대시보드 접속
2. Table Editor → `profiles` 테이블 선택
3. 모든 행 선택 후 삭제

### 방법 2: SQL로 삭제

Supabase SQL Editor에서 실행:

```sql
-- 모든 프로필 데이터 삭제
DELETE FROM public.profiles;

-- 또는 특정 사용자만 삭제 (이메일 기준)
DELETE FROM public.profiles WHERE email = 'test@oliveyoung.co.kr';
```

### 방법 3: 특정 사용자만 초기화

```sql
-- 특정 이메일의 프로필만 초기화
UPDATE public.profiles 
SET 
  name = NULL,
  employee_id = NULL,
  catering_type = NULL,
  enabled = false
WHERE email = 'test@oliveyoung.co.kr';
```

## 3. 완전 초기화 (모두)

### Extension Storage 초기화
```javascript
// Background Script 콘솔에서 실행
await chrome.storage.local.clear();
await chrome.alarms.clearAll();
console.log('✅ Extension 초기화 완료');
```

### Supabase 초기화
```sql
-- SQL Editor에서 실행
DELETE FROM public.profiles;
```

## 4. 확인 방법

### Extension Storage 확인
```javascript
// Background Script 콘솔에서 실행
chrome.storage.local.get(null, (data) => {
  console.log('현재 Storage:', data);
});
```

### Supabase 데이터 확인
```sql
-- SQL Editor에서 실행
SELECT * FROM public.profiles;
```

