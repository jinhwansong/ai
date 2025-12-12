// /api/daily/generate/route.ts
import { NextResponse } from 'next/server';
import { fetchDailyNews } from '@/lib/fetchNews';
import { saveDailyReport } from '@/lib/newsCache';
import { buildDailyPrompt } from '@/lib/prompt/buildDailyPrompt';
import { formatDate } from '@/hooks/utils';
import { runGPTJSON } from '@/lib/openai';

export async function GET() {
  try {
    // 1) 뉴스 수집
    const news = await fetchDailyNews();
    const newsCount = news?.length ?? 0;

    console.log(`[daily-generate] 뉴스 수집 완료: ${newsCount}건`);

    if (newsCount === 0) {
      throw new Error('뉴스 데이터가 없습니다.');
    }

    // 2) 프롬프트 생성
    const prompt = buildDailyPrompt(news);

    // 3) GPT 호출 → JSON 리포트 생성
    const data = await runGPTJSON(prompt);
    console.log('[daily-generate] GPT 응답:', data);

    if (!data || !Array.isArray(data.issues) || data.issues.length === 0) {
      console.error('[daily-generate] 모델 응답 이상:', data);
      throw new Error('GPT가 유효한 이슈 목록을 반환하지 않았습니다.');
    }

    // 4) 날짜 추가
    const date = formatDate();
    data.date = date;

    // 5) Redis 캐시에 저장
    await saveDailyReport(date, data);
    console.log(`[daily-generate] Redis 저장 완료: daily-report:${date}`);

    // 6) 정상 응답
    return NextResponse.json({ ok: true, date });
  } catch (err: unknown) {
    console.error('❌ 데일리 리포트 생성 오류:', err);
    const details =
      err instanceof Error ? err.message : '원인 불명';
    return NextResponse.json(
      { error: '리포트 생성 실패', details },
      { status: 500 }
    );
  }
}
