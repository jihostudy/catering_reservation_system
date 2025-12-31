# 폼 자동 입력 테스트 가이드

## 설치

```bash
cd extension
pnpm install
```

## 테스트 실행

```bash
pnpm test:form
```

또는 직접 실행:

```bash
npx tsx test-form-fill.ts
```

## 테스트 데이터 수정

`test-form-fill.ts` 파일에서 `TEST_DATA` 객체를 수정하여 테스트 데이터를 변경할 수 있습니다:

```typescript
const TEST_DATA = {
  email: "test@oliveyoung.co.kr",
  name: "홍길동",
  employeeId: "800000",
  cateringType: "1차수", // '1차수', '2차수', '3차수', '콤보', '샐러드'
};
```

## 동작 방식

1. 브라우저가 자동으로 열립니다 (headless: false)
2. 타겟 페이지로 이동합니다
3. 폼 필드를 자동으로 채웁니다
4. 입력된 값을 콘솔에 출력합니다
5. 제출 버튼을 클릭합니다 (찾을 수 있는 경우)
6. 10초 후 브라우저가 자동으로 닫힙니다

## 주의사항

- 실제 예약 사이트이므로 테스트 시 주의하세요
- 제출 버튼을 클릭하면 실제 예약이 진행될 수 있습니다
- 테스트 데이터를 사용하거나, 테스트 환경에서만 실행하세요
