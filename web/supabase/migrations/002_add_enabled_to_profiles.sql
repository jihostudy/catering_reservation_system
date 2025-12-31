-- profiles 테이블에 enabled 컬럼 추가
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS enabled BOOLEAN DEFAULT false;

