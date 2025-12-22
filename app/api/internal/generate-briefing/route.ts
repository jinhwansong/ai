import { NextResponse } from 'next/server';
import { TranslateNewsItem } from '@/types/news';
import { redis } from '@/lib/redis/redis';
import { generateBriefing } from '../../ai/gemini/briefing';

function auth(req: Request) {
  return (
    req.headers.get('x-internal-secret') === process.env.INTERNAL_API_SECRET
  );
}

export async function POST(req: Request) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const raw = await redis.get('news:raw');
    if (!raw) {
      return NextResponse.json({ error: 'no news data' }, { status: 400 });
    }

    const items = JSON.parse(raw) as TranslateNewsItem[];
    const briefing = await generateBriefing(items);

    await redis.set(`briefing:${briefing.id}`, JSON.stringify(briefing));
    await redis.set('main:briefing:latest', briefing.id);

    return NextResponse.json({
      success: true,
      briefingId: briefing.id,
      date: briefing.date,
      publishTime: briefing.publishTime,
    });
  } catch {
    return NextResponse.json(
      { error: 'generate briefing failed' },
      { status: 500 }
    );
  }
}
