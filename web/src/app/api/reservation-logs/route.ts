import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET: 현재 로그인한 사용자의 예약 이력 조회
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 최근 10개 이력만 조회
    const { data: logs, error } = await supabase
      .from('reservation_logs')
      .select('id, success, message, executed_at')
      .eq('user_id', user.id)
      .order('executed_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching reservation logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reservation logs', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      logs: logs || [],
    });
  } catch (error) {
    console.error('Error in reservation logs API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

