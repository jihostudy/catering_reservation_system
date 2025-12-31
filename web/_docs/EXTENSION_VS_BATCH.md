# 익스텐션 vs 배치 작업 비교

## 🎯 익스텐션의 작동 방식

### 현재 구현된 로직

```
1. Chrome Alarms API로 3시 알람 설정
   ↓
2. 3시가 되면 Service Worker가 깨어남
   ↓
3. chrome.tabs.create()로 타겟 페이지 열기
   ↓
4. Content Script가 페이지 로드 감지
   ↓
5. 폼 자동 입력 및 제출
   ↓
6. 결과를 Background Script로 전송
   ↓
7. 알림 표시
```

### 코드 흐름

**1. 알람 설정 (background.ts)**
```typescript
chrome.alarms.create(ALARM_NAME, {
  when: targetTime.getTime(),
  periodInMinutes: 24 * 60, // 매일 반복
});
```

**2. 알람 트리거 시 (background.ts)**
```typescript
chrome.alarms.onAlarm.addListener(async (alarm) => {
  // 타겟 페이지 열기
  const tab = await chrome.tabs.create({ 
    url: TARGET_URL, 
    active: true  // 탭이 열리지만 백그라운드에서도 작동
  });
  
  // 예약 데이터 저장
  await chrome.storage.local.set({ pendingReservation: schedule.reservationData });
});
```

**3. Content Script 실행 (content.ts)**
```typescript
// 페이지 로드 완료 후
checkAndExecutePendingReservation();

// 폼 자동 입력
await fillReservationForm(pendingData);

// 제출 버튼 클릭
submitButton.click();
```

---

## ✅ 익스텐션의 장점

### 1. 실제 브라우저 환경에서 실행
- ✅ 실제 Chrome 브라우저 사용
- ✅ 모든 브라우저 기능 사용 가능 (쿠키, 세션, JavaScript 등)
- ✅ CSRF 토큰 자동 처리
- ✅ 세션 쿠키 자동 포함
- ✅ JavaScript로 동적 생성되는 폼도 처리 가능

### 2. 완벽한 호환성
- ✅ 익스텐션이 작동하는 사이트는 100% 작동
- ✅ 사용자가 직접 하는 것과 동일한 방식
- ✅ 타겟 사이트가 변경되어도 대응 가능 (Content Script 수정)

### 3. 서버 리소스 불필요
- ✅ 사용자의 브라우저 활용
- ✅ 서버 비용 없음
- ✅ Vercel 제한 없음

### 4. 백그라운드 실행 가능
- ✅ Chrome이 실행 중이면 백그라운드에서 작동
- ✅ 사용자가 다른 탭을 보고 있어도 작동
- ✅ `active: true`로 설정되어 있어 탭이 열리지만, 백그라운드에서도 처리 가능

---

## ⚠️ 익스텐션의 제한사항

### 1. Chrome이 실행 중이어야 함
- ❌ Chrome이 완전히 종료되면 작동하지 않음
- ✅ Chrome이 백그라운드로 실행 중이면 작동
- ✅ Service Worker는 Chrome이 실행 중일 때만 작동

### 2. 사용자 기기 필요
- ❌ 사용자의 컴퓨터가 켜져있어야 함
- ❌ 사용자의 Chrome이 실행 중이어야 함
- ✅ 하지만 백그라운드 실행 가능

### 3. 탭이 열림
- ⚠️ `active: true`로 설정되어 있어 탭이 열림
- ✅ 하지만 사용자가 다른 탭을 보고 있으면 백그라운드에서 처리
- 💡 필요하면 `active: false`로 변경 가능 (백그라운드 탭)

---

## 🔄 배치 작업과 비교

| 항목 | 익스텐션 | 배치 작업 (HTTP POST) |
|------|---------|---------------------|
| **실행 환경** | 사용자 브라우저 | Vercel 서버 |
| **Chrome 필요** | ✅ 실행 중이어야 함 | ❌ 불필요 |
| **브라우저 기능** | ✅ 모두 사용 가능 | ❌ 제한적 |
| **CSRF 토큰** | ✅ 자동 처리 | ❌ 실패 가능 |
| **세션 쿠키** | ✅ 자동 포함 | ❌ 실패 가능 |
| **JavaScript 의존** | ✅ 처리 가능 | ❌ 실패 가능 |
| **서버 비용** | ✅ 무료 | ✅ 무료 (Vercel) |
| **안정성** | ✅ 높음 | ⚠️ 타겟 사이트에 따라 다름 |
| **백그라운드 실행** | ✅ 가능 | ✅ 가능 |

---

## 💡 실제 사용 시나리오

### 시나리오 1: 사용자가 컴퓨터를 켜두고 있음
```
✅ 익스텐션: 완벽하게 작동
✅ 배치 작업: 작동 (타겟 사이트가 단순하면)
```

### 시나리오 2: 사용자가 컴퓨터를 끄고 있음
```
❌ 익스텐션: 작동하지 않음 (Chrome이 종료됨)
✅ 배치 작업: 작동 (서버에서 실행)
```

### 시나리오 3: 사용자가 Chrome을 백그라운드로 실행 중
```
✅ 익스텐션: 백그라운드에서 작동 (탭이 열리지만 처리됨)
✅ 배치 작업: 작동
```

### 시나리오 4: 타겟 사이트가 복잡함 (CSRF, 세션 등)
```
✅ 익스텐션: 완벽하게 작동
❌ 배치 작업: 실패 가능
```

---

## 🎯 최적의 전략

### 하이브리드 접근

**1. 익스텐션 (주력)**
- 사용자가 Chrome을 켜두는 경우
- 가장 안정적이고 확실함
- 이미 구현되어 있고 작동 중

**2. 배치 작업 (보조)**
- 사용자가 Chrome을 끄고 있는 경우
- 익스텐션이 실패한 경우 백업
- 타겟 사이트가 단순하면 작동

**3. 사용자 선택**
- 대시보드에서 "자동 예약 활성화" 토글
- 익스텐션과 배치 작업 모두 활성화 가능
- 사용자가 원하는 방식 선택

---

## 🔧 개선 가능한 점

### 익스텐션 개선

**1. 백그라운드 탭으로 열기**
```typescript
// 현재
const tab = await chrome.tabs.create({ url: TARGET_URL, active: true });

// 개선: 백그라운드 탭
const tab = await chrome.tabs.create({ url: TARGET_URL, active: false });
```

**2. 작업 완료 후 탭 자동 닫기**
```typescript
// 예약 완료 후
chrome.tabs.remove(tab.id);
```

**3. 알림 개선**
- 성공/실패 알림
- 상세한 결과 메시지

---

## 📝 결론

### 익스텐션의 핵심 장점

1. **완벽한 호환성**
   - 실제 브라우저 환경
   - 모든 웹사이트 기능 사용 가능
   - 타겟 사이트 변경에도 대응 가능

2. **백그라운드 실행**
   - Chrome이 실행 중이면 백그라운드에서 작동
   - 사용자가 다른 작업을 해도 자동 예약
   - 탭이 열리지만 백그라운드에서 처리

3. **서버 비용 없음**
   - 사용자의 브라우저 활용
   - Vercel 제한 없음

### 제한사항

- Chrome이 실행 중이어야 함
- 사용자 기기가 켜져있어야 함

### 최종 권장사항

**익스텐션을 주력으로 사용하고, 배치 작업은 백업으로 활용**

- 익스텐션: 가장 안정적이고 확실함
- 배치 작업: 익스텐션이 작동하지 않을 때 백업

