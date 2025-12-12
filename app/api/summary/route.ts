// Gemini 요약 + 분석 API
import { NextResponse } from 'next/server';
import { buildSearchSummaryPrompt } from '@/lib/prompt/buildSearchSummaryPrompt';
import { runGPTJSON } from '@/lib/openai';
import type { NewsArticle } from '@/types/news';

export async function POST(req: Request) {
  try {
    const { keyword, news } = (await req.json()) as {
      keyword: string;
      news: NewsArticle[];
    };

    if (!keyword || !Array.isArray(news)) {
      return NextResponse.json(
        { error: 'keyword와 news 배열은 필수입니다.' },
        { status: 400 }
      );
    }

    const prompt = buildSearchSummaryPrompt(keyword, news);

    const summary = await runGPTJSON(prompt);

    return NextResponse.json(summary);
  } catch (err) {
    console.error('❌ Summary Error:', err);
    return NextResponse.json({ error: '요약 실패' }, { status: 500 });
  }
}
