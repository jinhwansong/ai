import { NextResponse } from 'next/server';
import { buildKeywordPrompt } from '@/lib/prompt/gemini.keyword';
import { redis } from '@/lib/redis/redis';
import { runGeminiJSON } from '@/lib/ai/gemini';
import { convertKeywordToEnglish } from '../../ai/gemini/keyword';
import { MainKeywordList } from '@/types/keyword';

function auth(req: Request) {
  return (
    req.headers.get('x-internal-secret') === process.env.INTERNAL_API_SECRET
  );
}

export async function POST(req: Request) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { keyword } = (await req.json()) as { keyword: string };

  const english = await convertKeywordToEnglish(keyword);
  const result = await runGeminiJSON(buildKeywordPrompt(english));

  await redis.set(`keyword:${english}`, JSON.stringify(result));

  const existing = await redis.get('main:keywords');
  const list: MainKeywordList = existing ? JSON.parse(existing) : [];

  if (!list.find((k) => k.tag === english)) {
    list.push({ tag: english, active: true });
    await redis.set('main:keywords', JSON.stringify(list));
  }

  return NextResponse.json({ success: true, tag: english });
}
