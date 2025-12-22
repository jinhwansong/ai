import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { generateStrategy } from '../../ai/gpt/strategy';
import { DailyBriefing } from '@/types/briefing';

function auth(req: Request) {
  return (
    req.headers.get('x-internal-secret') === process.env.INTERNAL_API_SECRET
  );
}

export async function POST(req: Request) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const latestId = await redis.get('main:briefing:latest');
  if (!latestId) {
    return NextResponse.json(
      { error: 'latest briefing not found' },
      { status: 404 }
    );
  }

  const full = await redis.get(`briefing:${latestId}`);
  if (!full) {
    return NextResponse.json(
      { error: 'briefing detail not found' },
      { status: 404 }
    );
  }

  const briefing = JSON.parse(full) as DailyBriefing;
  const strategy = await generateStrategy(briefing);

  await redis.set(`strategy:${latestId}`, JSON.stringify(strategy));
  await redis.set('main:strategy:latest', latestId);

  return NextResponse.json({
    success: true,
    date: strategy.date,
  });
}
