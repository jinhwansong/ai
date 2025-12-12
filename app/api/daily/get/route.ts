// Redis에 저장된 데일리 리포트를 가져오는 API
import { NextRequest, NextResponse } from 'next/server';
import { formatDate } from '@/hooks/utils';
import { getDailyReport, saveDailyReport } from '@/lib/newsCache';
import { fetchDailyNews } from '@/lib/fetchNews';
import { buildDailyPrompt } from '@/lib/prompt/buildDailyPrompt';
import { runGPTJSON } from '@/lib/openai';


export async function GET(req: NextRequest) {
  try {
    const targetDate = req.nextUrl.searchParams.get('date') ?? formatDate();
    const data = await getDailyReport(targetDate);

    // 데이터 없을 때 기본 구조 반환
    if (!data) {
      try {
        // 캐시에 없으면 즉시 생성 시도
        const news = await fetchDailyNews();
        const newsCount = news?.length ?? 0;
        if (!newsCount) {
          console.error('[daily-get] 뉴스 데이터가 없습니다.');
          return NextResponse.json(
            { error: '뉴스 데이터가 없습니다.', date: targetDate },
            { status: 500 }
          );
        }

        const prompt = buildDailyPrompt(news);
        const generated = await runGPTJSON(prompt);

        if (!generated || !Array.isArray(generated.issues) || generated.issues.length === 0) {
          console.error('[daily-get] 모델이 유효한 이슈를 반환하지 않음');
          return NextResponse.json(
            { error: '모델이 유효한 이슈를 반환하지 않았습니다.', date: targetDate },
            { status: 500 }
          );
        }

        generated.date = targetDate;
        await saveDailyReport(targetDate, generated);
        return NextResponse.json(generated);
      } catch (genErr) {
        console.error('❌ 데일리 리포트 생성 실패 (캐시 미스 처리 중):', genErr);
        return NextResponse.json(
          { error: '데일리 리포트 생성 실패', date: targetDate },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ 데일리 조회 오류:', error);
    return NextResponse.json(
      { error: '데일리 리포트 조회 실패' },
      { status: 500 }
    );
  }
}

export async function exampleNewsCacheUsage() {
  const targetDate = formatDate();

  if (!targetDate) {
    return null;
  }

  await saveDailyReport(targetDate, {
    date: targetDate,
    issues: [], 
  });

  return getDailyReport(targetDate);
}
