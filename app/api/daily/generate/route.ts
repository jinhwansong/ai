// 데일리 리포트 API
import { fetchDailyNews } from '@/lib/fetchNews';
import { runGeminiJSON } from '@/lib/gemini';
import { saveDailyReport } from '@/lib/kv';
import { buildDailyPrompt } from '@/lib/prompt/buildDailyPrompt';
import { formatDate } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const news = await fetchDailyNews();
    const prompt = buildDailyPrompt(news);
    const data = await runGeminiJSON(prompt);

    data.date = formatDate();

    await saveDailyReport(data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('❌ Daily Generate Error:', err);
    return NextResponse.json({ error: '리포트 생성 실패' }, { status: 500 });
  }
}
