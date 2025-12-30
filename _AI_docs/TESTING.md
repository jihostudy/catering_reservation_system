# 크롬 익스텐션 테스트 가이드

## 1. 빌드 확인

익스텐션을 빌드합니다:

```bash
cd extension
pnpm build
```

빌드가 성공하면 `dist/` 폴더에 다음 파일들이 생성됩니다:
- `dist/background.js`
- `dist/content.js`
- 각각의 `.map` 파일 (소스맵)

## 2. Chrome에 익스텐션 로드하기

1. **Chrome 브라우저 열기**
2. **확장 프로그램 페이지로 이동**
   - 주소창에 `chrome://extensions/` 입력
   - 또는 메뉴 → 확장 프로그램 → 확장 프로그램 관리
3. **개발자 모드 활성화**
   - 우측 상단의 "개발자 모드" 토글을 켭니다
4. **압축해제된 확장 프로그램을 로드합니다**
   - "압축해제된 확장 프로그램을 로드합니다" 버튼 클릭
   - `extension` 폴더 선택 (루트 폴더, `dist` 폴더가 아닌)
5. **로드 확인**
   - 익스텐션 목록에 "Katering Auto Reservation"이 나타나야 합니다
   - 오류가 있으면 빨간색으로 표시됩니다

## 3. 기본 기능 테스트

### 3.1 익스텐션 팝업 확인

1. Chrome 툴바에서 익스텐션 아이콘 클릭 (없으면 퍼즐 아이콘 → Katering 고정)
2. 팝업이 열리면:
   - 상태가 "자동 예약 비활성화"로 표시되어야 합니다
   - 예약 시간, 이름, 케이터링이 모두 "-"로 표시되어야 합니다

### 3.2 Chrome Storage 확인

1. 익스텐션 팝업에서 우클릭 → "검사" (또는 개발자 도구 열기)
2. Console 탭에서 다음 명령 실행:

```javascript
chrome.storage.local.get(null, (data) => {
  console.log('Storage:', data);
});
```

기본값이 설정되어 있어야 합니다:
```javascript
{
  schedule: {
    enabled: false,
    targetHour: 15,
    targetMinute: 0,
    reservationData: null
  },
  history: []
}
```

### 3.3 Background Script 로그 확인

1. `chrome://extensions/` 페이지에서
2. "Katering Auto Reservation" 카드에서 "service worker" 링크 클릭
3. 개발자 도구가 열리면 Console 탭 확인
4. 다음과 같은 로그가 보여야 합니다:
   ```
   [Katering] Extension installed/updated
   [Katering] Alarm disabled or no reservation data
   ```

### 3.4 수동 예약 테스트 (테스트용)

실제 3시까지 기다리지 않고 테스트하려면:

1. Background Script 개발자 도구 Console에서:

```javascript
// 테스트용 예약 데이터 설정
chrome.storage.local.set({
  schedule: {
    enabled: true,
    targetHour: new Date().getHours(),
    targetMinute: new Date().getMinutes() + 1, // 1분 후
    reservationData: {
      email: 'test@example.com',
      name: '테스트',
      employeeId: 'TEST001',
      cateringType: 'lunch'
    }
  }
}, () => {
  console.log('Test schedule set');
  // 알람 재설정을 위해 메시지 전송
  chrome.runtime.sendMessage({ 
    type: 'UPDATE_SCHEDULE', 
    schedule: {
      enabled: true,
      targetHour: new Date().getHours(),
      targetMinute: new Date().getMinutes() + 1,
      reservationData: {
        email: 'test@example.com',
        name: '테스트',
        employeeId: 'TEST001',
        cateringType: 'lunch'
      }
    }
  });
});
```

2. 1분 후 타겟 페이지가 자동으로 열리는지 확인
3. Content Script가 실행되어 폼을 채우는지 확인

### 3.5 Content Script 테스트

1. 타겟 페이지 직접 열기: `https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/`
2. 개발자 도구 열기 (F12)
3. Console 탭에서 다음 로그 확인:
   ```
   [Katering] No pending reservation
   ```
4. 수동으로 예약 실행 테스트:

```javascript
// Background Script Console에서
chrome.storage.local.set({
  pendingReservation: {
    email: 'test@example.com',
    name: '테스트',
    employeeId: 'TEST001',
    cateringType: 'lunch'
  }
});

// 그 다음 타겟 페이지 새로고침
```

## 4. 알람 테스트

### 4.1 알람 설정 확인

Background Script Console에서:

```javascript
chrome.alarms.getAll((alarms) => {
  console.log('All alarms:', alarms);
});
```

### 4.2 알람 즉시 트리거 (테스트용)

```javascript
// 알람을 10초 후로 설정
const testTime = Date.now() + 10000;
chrome.alarms.create('katering-reservation-alarm', {
  when: testTime
});

console.log('Test alarm set for', new Date(testTime).toLocaleString());
```

## 5. 문제 해결

### 익스텐션이 로드되지 않음
- `manifest.json` 문법 오류 확인
- `dist/background.js`, `dist/content.js` 파일 존재 확인
- Chrome 개발자 도구의 오류 메시지 확인

### Background Script가 실행되지 않음
- Service Worker가 중지되었는지 확인 (`chrome://extensions/`에서 재시작)
- Console에 오류 메시지 확인

### Content Script가 실행되지 않음
- 타겟 URL이 정확한지 확인 (`https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/*`)
- 페이지 새로고침
- Content Script Console 확인 (페이지 개발자 도구가 아닌 익스텐션 개발자 도구)

### 알람이 트리거되지 않음
- Chrome이 백그라운드에서 실행 중인지 확인
- 알람이 실제로 설정되었는지 `chrome.alarms.getAll()`로 확인
- 시간이 이미 지났는지 확인

## 6. 다음 단계

익스텐션이 정상 작동하는 것을 확인했다면:

1. 타겟 사이트의 실제 폼 구조 분석
2. `content.ts`의 `FORM_SELECTORS` 업데이트
3. 실제 예약 데이터로 테스트
4. 웹 대시보드와의 동기화 구현

