// KV에서 저장된 데일리 리포트를 가져오는 API
import { NextResponse } from 'next/server';
import { getDailyReport } from '@/lib/kv';

export async function GET() {
  try {
    const data = await getDailyReport();

    // 데이터 없을 때 기본 구조 반환
    if (!data) {
      return NextResponse.json({
        date: null,
        issues: [],
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Daily Get Error:', error);
    return NextResponse.json(
      { error: '데일리 리포트 조회 실패' },
      { status: 500 }
    );
  }
}
