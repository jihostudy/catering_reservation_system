# 익스텐션 디버깅 가이드

## 저장된 데이터 확인 방법

### 1. Chrome 개발자 도구에서 확인

#### 방법 1: Extension Storage 확인
1. 익스텐션 팝업을 열고 **우클릭** → **검사** (Inspect)
2. **Console** 탭에서 다음 명령어 실행:

```javascript
// 현재 저장된 스케줄 확인
chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
  console.log('Current Schedule:', response.schedule);
  console.log('Last Result:', response.lastResult);
});

// 또는 직접 Storage 확인
chrome.storage.local.get(['schedule', 'lastResult', 'history'], (data) => {
  console.log('All Storage Data:', data);
});
```

#### 방법 2: Background Script 확인
1. Chrome 확장 프로그램 관리 페이지 (`chrome://extensions/`)
2. "Catering Auto Reservation" 익스텐션 찾기
3. **"서비스 워커"** 또는 **"배경 페이지"** 클릭
4. Console 탭에서 위와 동일한 명령어 실행

### 2. 익스텐션 팝업 콘솔에서 확인

1. 익스텐션 아이콘 **우클릭** → **검사**
2. Console 탭에서 자동으로 로그가 출력됩니다:
   - `[Catering] Popup loaded, checking storage...`
   - `[Catering] Current storage data: {...}`

### 3. 웹사이트 API에서 확인

브라우저 콘솔에서 (대시보드 페이지에서):

```javascript
// 현재 로그인한 사용자 정보 확인
fetch('/api/users', {
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log('Web API Data:', data));
```

### 4. 대시보드 Content Script 확인

대시보드 페이지에서 브라우저 콘솔:

```javascript
// 대시보드에서 추출된 정보 확인
// (dashboard-content.js가 실행 중이면 자동으로 로그 출력)
```

## 데이터 저장 흐름 확인

### 저장 경로 1: 대시보드에서 저장
```
1. 대시보드에서 "저장하기" 클릭
   ↓
2. API 호출: PUT /api/users
   ↓
3. dashboard-content.js가 폼 변경 감지
   ↓
4. extractUserInfo() 실행
   ↓
5. saveUserInfoToExtension() 실행
   ↓
6. Chrome Storage에 저장
   ↓
7. 콘솔에 로그: "[Catering] User info saved to extension: {...}"
```

### 저장 경로 2: 익스텐션 팝업에서 동기화
```
1. 익스텐션 팝업 열기
   ↓
2. 로그인 상태 확인
   ↓
3. syncUserDataFromWeb() 실행
   ↓
4. API 호출: GET /api/users
   ↓
5. 응답 데이터로 Chrome Storage 업데이트
   ↓
6. UI 업데이트
   ↓
7. 콘솔에 로그: "[Catering] User data received: {...}"
```

## 문제 해결

### 데이터가 저장되지 않는 경우

1. **대시보드 콘솔 확인**
   - 브라우저 개발자 도구 → Console
   - `[Catering]` 로그 확인
   - 에러 메시지 확인

2. **익스텐션 팝업 콘솔 확인**
   - 익스텐션 아이콘 우클릭 → 검사
   - Console 탭에서 로그 확인

3. **Network 탭 확인**
   - 대시보드에서 저장 시 Network 탭 확인
   - `/api/users` PUT 요청이 성공했는지 확인
   - 응답 상태 코드 확인 (200 OK)

4. **Chrome Storage 직접 확인**
   ```javascript
   chrome.storage.local.get(null, (data) => {
     console.log('All Chrome Storage:', data);
   });
   ```

### 데이터가 표시되지 않는 경우

1. **로그인 상태 확인**
   - 익스텐션 팝업에서 "로그인됨" 표시 확인
   - "로그인 필요"가 표시되면 로그인 필요

2. **API 응답 확인**
   - 익스텐션 팝업 콘솔에서 `[Catering] User data received` 로그 확인
   - 데이터가 제대로 오는지 확인

3. **수동 동기화**
   - 익스텐션 팝업을 닫았다가 다시 열기
   - 또는 대시보드 페이지 새로고침

## 빠른 확인 명령어

익스텐션 팝업 콘솔에서:

```javascript
// 현재 저장된 모든 데이터 확인
chrome.storage.local.get(null, console.log);

// 스케줄만 확인
chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (res) => {
  console.log('Schedule:', res.schedule);
  console.log('Reservation Data:', res.schedule?.reservationData);
});

// 웹사이트 API에서 데이터 가져오기
fetch('https://cateringreservationsystem.vercel.app/api/users', {
  credentials: 'include'
})
  .then(r => r.json())
  .then(console.log);
```

## 예상되는 데이터 구조

### Chrome Storage
```json
{
  "schedule": {
    "enabled": true,
    "targetHour": 15,
    "targetMinute": 0,
    "reservationData": {
      "email": "calekim@oliveyoung.co.kr",
      "name": "김지호",
      "employeeId": "D90007441",
      "cateringType": "1차수"
    }
  },
  "lastResult": {
    "success": true,
    "message": "예약 신청 완료",
    "timestamp": 1234567890
  },
  "history": [...]
}
```

### 웹사이트 API 응답
```json
{
  "id": "user-uuid",
  "email": "calekim@oliveyoung.co.kr",
  "name": "김지호",
  "employee_id": "D90007441",
  "catering_type": "1차수",
  "enabled": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

