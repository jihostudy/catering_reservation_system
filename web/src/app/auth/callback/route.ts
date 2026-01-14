import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ALLOWED_DOMAIN = "@oliveyoung.co.kr";

/**
 * OAuth 콜백 처리
 * Google 로그인 후 리다이렉트되는 엔드포인트
 * 이메일 도메인 검증 포함
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams, origin, hostname } = requestUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  // 로컬호스트 감지 (hostname 기준)
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

  // 디버깅: 요청 정보 로그
  console.log(`[Auth Callback] Request received:`, {
    url: request.url,
    hostname,
    origin,
    code: code ? "present" : "missing",
    next,
    isLocalhost,
  });

  if (code) {
    console.log(`[Auth Callback] Processing code exchange...`);
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(`[Auth Callback] Code exchange error:`, error);
    }

    if (!error) {
      // 사용자 정보 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 이메일 도메인 검증
      if (user?.email && !user.email.endsWith(ALLOWED_DOMAIN)) {
        // 허용되지 않은 도메인 - 로그아웃하고 메인 페이지로 에러 정보와 함께 리다이렉트
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/?error=invalid_domain&message=${encodeURIComponent(
            "올리브영 이메일(@oliveyoung.co.kr)만 사용 가능합니다."
          )}`
        );
      }

      // 사용자 정보를 profiles 테이블에 저장 (upsert)
      if (user?.id && user?.email) {
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email,
            // Google OAuth에서 가져온 이름이 있으면 저장
            name:
              user.user_metadata?.full_name || user.user_metadata?.name || null,
          },
          {
            onConflict: "id",
            ignoreDuplicates: false,
          }
        );

        if (profileError) {
          console.error("Failed to save user profile:", profileError);
          // 프로필 저장 실패해도 로그인은 진행 (나중에 수정 가능)
        }
      }

      // 환경에 따라 리다이렉트 URL 결정 (request URL의 hostname 기준)
      let redirectUrl: string;

      if (isLocalhost) {
        // 로컬 환경: localhost:3000 사용 (포트도 포함)
        const port = requestUrl.port || "3000";
        redirectUrl = `http://localhost:${port}${next}`;
      } else {
        // 프로덕션 환경: 현재 origin 사용 (request URL 기준)
        redirectUrl = `${origin}${next}`;
      }

      console.log(
        `[Auth Callback] Redirecting to: ${redirectUrl} (hostname: ${hostname})`
      );
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 에러 발생 시 에러 페이지로
  console.log(`[Auth Callback] No code found, redirecting to error page`);
  return NextResponse.redirect(`${origin}/auth/error`);
}
