import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

/**
 * 케이터링 타입 값 매핑
 */
const CATERING_TYPE_MAP: Record<string, string> = {
  '1차수': '01',
  '2차수': '02',
  '3차수': '03',
  '콤보': '04',
  '샐러드': '05',
  lunch: '01',
  dinner: '02',
  combo: '04',
  salad: '05',
};

/**
 * 타겟 사이트 URL
 */
const TARGET_URL = 'https://oz.d1qwefwlwtxtfr.amplifyapp.com/apply/';

/**
 * 예약 실행 함수
 * HTTP 요청으로 폼 제출 시도
 */
async function executeReservation(user: {
  id: string;
  email: string;
  name: string;
  employee_id: string;
  catering_type: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // 케이터링 타입 매핑
    const mappedType = CATERING_TYPE_MAP[user.catering_type] || user.catering_type;

    // 폼 데이터 준비
    const formData = new URLSearchParams({
      email: user.email,
      name: user.name,
      empNo: user.employee_id,
      type: mappedType,
    });

    // HTTP POST 요청으로 폼 제출 시도
    const response = await fetch(TARGET_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: formData.toString(),
      redirect: 'follow',
    });

    // 응답 확인
    const responseText = await response.text();

    // 성공 여부 판단 (실제 사이트 응답에 따라 조정 필요)
    if (response.ok || response.status === 200) {
      // 성공 메시지 확인 (실제 사이트 응답에 따라 조정 필요)
      if (
        responseText.includes('성공') ||
        responseText.includes('완료') ||
        responseText.includes('신청') ||
        response.status === 200
      ) {
        return {
          success: true,
          message: '예약이 성공적으로 제출되었습니다.',
        };
      }
    }

    return {
      success: false,
      message: `예약 제출 실패: HTTP ${response.status}`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      message: `예약 실행 중 오류 발생: ${errorMessage}`,
    };
  }
}

/**
 * 예약 로그 저장
 */
async function saveReservationLog(
  supabase: any,
  userId: string,
  success: boolean,
  message: string
): Promise<void> {
  try {
    await supabase.from('reservation_logs').insert({
      user_id: userId,
      success,
      message,
      executed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to save reservation log:', error);
  }
}

/**
 * GET: 배치 작업 실행
 * Vercel Cron Jobs에서 호출
 * 
 * 보안: CRON_SECRET 환경 변수로 인증
 */
export async function GET(request: Request) {
  try {
    // 보안: CRON_SECRET 확인
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 배치 작업은 서비스 키를 사용하여 모든 사용자 프로필에 접근
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // 활성화된 사용자 조회 (필수 필드가 모두 채워진 사용자만)
    const { data: enabledUsers, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email, name, employee_id, catering_type')
      .eq('enabled', true)
      .not('name', 'is', null)
      .not('employee_id', 'is', null)
      .not('catering_type', 'is', null);

    if (fetchError) {
      console.error('Error fetching enabled users:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch enabled users', details: fetchError },
        { status: 500 }
      );
    }

    if (!enabledUsers || enabledUsers.length === 0) {
      return NextResponse.json({
        message: 'No enabled users found',
        processed: 0,
        successful: 0,
        failed: 0,
      });
    }

    // 각 사용자에 대해 예약 실행
    const results = await Promise.allSettled(
      enabledUsers.map(async (user) => {
        const result = await executeReservation({
          id: user.id,
          email: user.email,
          name: user.name!,
          employee_id: user.employee_id!,
          catering_type: user.catering_type!,
        });

        // 로그 저장
        await saveReservationLog(supabase, user.id, result.success, result.message);

        return {
          userId: user.id,
          email: user.email,
          ...result,
        };
      })
    );

    // 결과 집계
    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value.success
    ).length;
    const failed = results.length - successful;

    // 실패한 경우 상세 정보
    const failures = results
      .filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success))
      .map((r) => {
        if (r.status === 'rejected') {
          return { error: r.reason?.message || 'Unknown error' };
        }
        return r.value;
      });

    return NextResponse.json({
      message: 'Batch reservation completed',
      processed: enabledUsers.length,
      successful,
      failed,
      failures: failures.length > 0 ? failures : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in batch reservation:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

