# 배치 작업 설정 가이드

## 개요

매일 오후 3시(15:00)에 활성화된 사용자들을 대상으로 자동 예약을 실행하는 배치 작업입니다.

## 구현 내용

### 1. API 엔드포인트

- **경로**: `/api/cron/reservation`
- **메서드**: `GET`
- **인증**: `CRON_SECRET` 환경 변수로 보호

### 2. 동작 방식

1. 활성화된 사용자 조회 (`enabled = true`)
2. 필수 필드 검증 (이름, 사번, 케이터링 타입)
3. 각 사용자에 대해 예약 실행
4. 결과를 `reservation_logs` 테이블에 저장

### 3. Vercel Cron 설정

`vercel.json` 파일에 다음 설정이 포함되어 있습니다:

```json
{
  "crons": [
    {
      "path": "/api/cron/reservation",
      "schedule": "0 15 * * *"
    }
  ]
}
```

- **스케줄**: 매일 15:00 (오후 3시) UTC
- **참고**: 한국 시간(KST, UTC+9)으로는 매일 자정 00:00에 실행됩니다.

### 4. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

#### 필수 환경 변수

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 서비스 역할 키 (모든 사용자 조회용)
- `CRON_SECRET`: 배치 작업 보안을 위한 시크릿 키 (선택사항)

#### Supabase 서비스 키 가져오기

1. Supabase 대시보드 접속
2. Settings → API
3. "service_role" 키 복사 (주의: 이 키는 서버에서만 사용해야 합니다)

### 5. 데이터베이스 마이그레이션

다음 마이그레이션 파일을 실행해야 합니다:

```bash
# Supabase 대시보드에서 SQL Editor로 실행
web/supabase/migrations/003_create_reservation_logs.sql
```

### 6. 수동 실행 (테스트용)

브라우저나 curl로 수동 실행 가능:

```bash
# CRON_SECRET이 설정된 경우
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.vercel.app/api/cron/reservation

# CRON_SECRET이 설정되지 않은 경우 (개발 환경)
curl https://your-domain.vercel.app/api/cron/reservation
```

### 7. 예약 실행 로직

현재는 HTTP POST 요청으로 폼을 제출하는 방식을 사용합니다.

**주의**: 타겟 사이트가 CSRF 보호나 세션 기반 인증을 사용하는 경우, 이 방식이 작동하지 않을 수 있습니다.

**대안**:

- Puppeteer를 사용한 브라우저 자동화 (별도 서버 필요)
- 외부 서비스 활용 (예: Browserless.io, ScrapingBee)

### 8. 예약 이력 확인

대시보드 페이지에서 최근 예약 이력을 확인할 수 있습니다.

## 문제 해결

### 배치 작업이 실행되지 않는 경우

1. Vercel 대시보드에서 Cron Jobs 상태 확인
2. 환경 변수 설정 확인
3. API 엔드포인트 로그 확인 (Vercel Functions 로그)

### 예약이 실패하는 경우

1. 타겟 사이트의 폼 구조 변경 여부 확인
2. HTTP 요청 방식이 작동하는지 확인
3. `reservation_logs` 테이블에서 실패 메시지 확인

### 시간대 문제

Vercel Cron은 UTC 시간을 사용합니다. 한국 시간(KST)으로 오후 3시에 실행하려면:

```json
{
  "schedule": "0 6 * * *" // UTC 06:00 = KST 15:00
}
```

## 보안 고려사항

1. **CRON_SECRET**: 프로덕션 환경에서는 반드시 설정
2. **서비스 키**: 절대 클라이언트에 노출하지 않음
3. **RLS 정책**: 서비스 키는 RLS를 우회하므로 주의
