-- 예약 실행 로그 테이블 생성
CREATE TABLE IF NOT EXISTS public.reservation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  success BOOLEAN NOT NULL,
  message TEXT,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_reservation_logs_user_id ON public.reservation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_reservation_logs_executed_at ON public.reservation_logs(executed_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.reservation_logs ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 예약 로그만 조회 가능
CREATE POLICY "Users can view own reservation logs"
  ON public.reservation_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- 정책: 서비스 역할은 모든 예약 로그를 삽입 가능 (배치 작업용)
-- 주의: 이 정책은 서비스 키를 사용하는 경우에만 작동합니다
CREATE POLICY "Service role can insert reservation logs"
  ON public.reservation_logs
  FOR INSERT
  WITH CHECK (true);

