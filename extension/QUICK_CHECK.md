# 빠른 저장 확인 가이드

## ✅ 저장 확인 방법 (Background Script 오류 시)

Background script 연결 오류가 발생하면, Chrome Storage에 직접 접근해서 확인하세요.

### 익스텐션 팝업 콘솔에서 실행:

```javascript
// Chrome Storage 직접 확인 (가장 확실한 방법)
chrome.storage.local.get(null, (data) => {
  console.log("📦 전체 Storage:", data);
  console.log("📋 Schedule:", data.schedule);
  console.log("👤 Reservation Data:", data.schedule?.reservationData);

  if (data.schedule?.reservationData) {
    console.log("✅ 저장 확인됨!");
    console.log("이메일:", data.schedule.reservationData.email);
    console.log("이름:", data.schedule.reservationData.name);
    console.log("사번:", data.schedule.reservationData.employeeId);
    console.log("케이터링 타입:", data.schedule.reservationData.cateringType);
  } else {
    console.log("❌ 저장되지 않음");
  }
});
```

## 🔧 Background Script 오류 해결

### 오류: "Could not establish connection. Receiving end does not exist."

이 오류는 background script가 로드되지 않았거나 응답하지 않을 때 발생합니다.

### 해결 방법:

1. **익스텐션 재로드**

   - `chrome://extensions/` 접속
   - "Catering Auto Reservation" 찾기
   - 새로고침 아이콘 클릭

2. **Background Script 확인**

   - `chrome://extensions/` 접속
   - "Catering Auto Reservation" 찾기
   - **"서비스 워커"** 또는 **"배경 페이지"** 클릭
   - Console 탭에서 에러 확인

3. **빌드 확인**

   ```bash
   cd extension
   npm run build
   ```

   - `dist/background.js` 파일이 생성되었는지 확인

4. **수동으로 데이터 저장 테스트**
   ```javascript
   // 익스텐션 팝업 콘솔에서
   chrome.storage.local.set(
     {
       schedule: {
         enabled: false,
         targetHour: 15,
         targetMinute: 0,
         reservationData: {
           email: "calekim@oliveyoung.co.kr",
           name: "김지호",
           employeeId: "D90007441",
           cateringType: "1차수",
         },
       },
     },
     () => {
       console.log("✅ 수동 저장 완료");
       chrome.storage.local.get("schedule", (data) => {
         console.log("저장된 데이터:", data.schedule);
       });
     }
   );
   ```

## 📊 데이터 저장 상태 확인 체크리스트

- [ ] Chrome Storage에 데이터가 있는지 확인
- [ ] Background script가 실행 중인지 확인
- [ ] 익스텐션이 최신 버전으로 빌드되었는지 확인
- [ ] 대시보드에서 저장 후 콘솔 로그 확인
- [ ] 익스텐션 팝업 콘솔에서 로그 확인
