# 빠른 테스트 가이드

## ✅ 준비 완료 상태

- ✅ 빌드 완료 (`dist/content.js` 5.80 KB)
- ✅ 실제 HTML 구조에 맞게 선택자 수정 완료
- ✅ 케이터링 타입 값 매핑 완료
- ✅ 모든 필수 필드 검증 추가

## 🚀 Chrome에 로드하기

### 1단계: 익스텐션 로드

1. Chrome 브라우저 열기
2. 주소창에 `chrome://extensions/` 입력
3. 우측 상단 **"개발자 모드"** 활성화
4. **"압축해제된 확장 프로그램을 로드합니다"** 클릭
5. `extension` 폴더 선택 (루트 폴더, `dist` 폴더가 아님)

### 2단계: 로드 확인

- ✅ "Catering Auto Reservation"이 목록에 나타나야 함
- ✅ 오류가 없어야 함 (빨간색 표시 없음)
- ✅ 아이콘이 표시되어야 함

## 🧪 기본 기능 테스트

### 테스트 1: 팝업 확인

1. Chrome 툴바에서 익스텐션 아이콘 클릭
2. 팝업이 열리고 "자동 예약 비활성화" 상태 표시 확인

### 테스트 2: Background Script 확인

1. `chrome://extensions/`에서 "service worker" 링크 클릭
2. Console에 다음 로그 확인:
   ```
   [Catering] Extension installed/updated
   ```

### 테스트 3: 수동 예약 테스트 (1분 후 실행)

Background Script Console에서 실행:

```javascript
const now = new Date();
chrome.storage.local.set(
  {
    schedule: {
      enabled: true,
      targetHour: now.getHours(),
      targetMinute: now.getMinutes() + 1,
      reservationData: {
        email: "test@oliveyoung.co.kr",
        name: "테스트",
        employeeId: "800000",
        cateringType: "1차수",
      },
    },
  },
  () => {
    chrome.runtime.sendMessage({
      type: "UPDATE_SCHEDULE",
      schedule: {
        enabled: true,
        targetHour: now.getHours(),
        targetMinute: now.getMinutes() + 1,
        reservationData: {
          email: "test@oliveyoung.co.kr",
          name: "테스트",
          employeeId: "800000",
          cateringType: "1차수",
        },
      },
    });
    console.log("테스트 스케줄 설정 완료! 1분 후 실행됩니다.");
  }
);
```

### 테스트 4: 즉시 실행 테스트

타겟 페이지에서 즉시 테스트하려면:

1. 타겟 페이지 열기: `https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/`
2. Background Script Console에서:

```javascript
chrome.storage.local.set({
  pendingReservation: {
    email: "test@oliveyoung.co.kr",
    name: "테스트",
    employeeId: "800000",
    cateringType: "1차수",
  },
});
```

3. 타겟 페이지 새로고침 (F5)
4. 페이지 Console (F12)에서 다음 로그 확인:
   ```
   [Catering] Found pending reservation, executing...
   [Catering] Starting form fill with data: {...}
   [Catering] Form filled: {...}
   [Catering] Form submitted
   ```

## ✅ 확인 사항

### 성공 시

- ✅ 폼이 자동으로 채워짐
- ✅ 케이터링 타입이 올바르게 선택됨
- ✅ 제출 버튼이 클릭됨
- ✅ 알림이 표시됨 (성공/실패)

### 실패 시 확인

1. **필드를 찾을 수 없음**

   - 페이지가 완전히 로드되었는지 확인
   - 개발자 도구에서 실제 필드명 확인

2. **제출 버튼을 찾을 수 없음**

   - 버튼이 비활성화되어 있는지 확인
   - 페이지가 완전히 로드되었는지 확인

3. **케이터링 타입이 선택되지 않음**
   - `cateringType` 값이 올바른지 확인 ("1차수", "2차수" 등)
   - Console에서 매핑된 값 확인

## 📝 테스트 체크리스트

- [ ] 익스텐션 로드 성공
- [ ] 팝업 정상 작동
- [ ] Background Script 정상 실행
- [ ] 이메일 필드 자동 입력
- [ ] 이름 필드 자동 입력
- [ ] 사번 필드 자동 입력
- [ ] 케이터링 타입 선택 (각 옵션별)
- [ ] 제출 버튼 클릭
- [ ] 알림 표시

## 🎯 다음 단계

테스트가 성공하면:

1. 실제 예약 데이터로 테스트
2. 웹 대시보드와 연동 구현
3. 실제 3시 알람 테스트
