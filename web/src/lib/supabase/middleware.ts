import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * 미들웨어용 Supabase 클라이언트
 * 세션 갱신 및 인증 체크에 사용
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 세션 갱신 (중요: getUser 호출 필수)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호된 경로 체크
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isHomePage = request.nextUrl.pathname === '/';

  if (isProtectedRoute && !user) {
    // 미인증 사용자는 메인 페이지로
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAuthRoute && user) {
    // 이미 로그인된 사용자는 대시보드로
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 메인 페이지에 로그인된 사용자가 접근하면 대시보드로 리다이렉트
  if (isHomePage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}
