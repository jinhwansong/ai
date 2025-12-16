import { NextResponse } from 'next/server';
import { generateDailyReport } from '@/lib/report/generateDailyReport';
import { getDailyReport, saveDailyReport } from '@/lib/redis/newsCache';

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    // 캐시 조회
    const cached = await getDailyReport(today);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // 없을시 생성
    const report = await generateDailyReport();

    // 캐시저장
    await saveDailyReport(report);

    return NextResponse.json({
      success: true,
      data: report,
      cached: false,
    });
  } catch (error) {
    console.error('데일리 api 에러', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : '데일리 리포트 생성 실패',
      },
      { status: 400 }
    );
  }
}
