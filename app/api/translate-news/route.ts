import { NextResponse } from 'next/server';
import { runGPTJSON } from '@/lib/openai';
import { buildNewsTranslatePrompt } from '@/lib/prompt/buildNewsTranslatePrompt';
import type { NewsArticle } from '@/types/news';

export async function POST(req: Request) {
  try {
    const { articles } = (await req.json()) as { articles: NewsArticle[] };

    if (!Array.isArray(articles)) {
      return NextResponse.json(
        { error: 'articles 배열은 필수입니다.' },
        { status: 400 }
      );
    }

    const items = articles
      .slice(0, 10)
      .map((a) => ({
        url: a.url,
        title: a.title ?? '',
        description: a.description ?? '',
      }))
      .filter((it) => it.url && (it.title || it.description));

    if (items.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const prompt = buildNewsTranslatePrompt(items);
    const translated = await runGPTJSON(prompt);
    return NextResponse.json(translated);
  } catch (err) {
    const message = err instanceof Error ? err.message : '번역 실패';
    console.error('❌ Translate News Error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


