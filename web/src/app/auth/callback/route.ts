import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_DOMAIN = '@oliveyoung.co.kr';

/**
 * OAuth 콜백 처리
 * Google 로그인 후 리다이렉트되는 엔드포인트
 * 이메일 도메인 검증 포함
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();
      
      // 이메일 도메인 검증
      if (user?.email && !user.email.endsWith(ALLOWED_DOMAIN)) {
        // 허용되지 않은 도메인 - 로그아웃하고 에러 페이지로
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/auth/error?message=${encodeURIComponent('올리브영 이메일(@oliveyoung.co.kr)만 사용 가능합니다.')}`
        );
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // 에러 발생 시 에러 페이지로
  return NextResponse.redirect(`${origin}/auth/error`);
}
