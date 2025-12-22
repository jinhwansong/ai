import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';

export async function GET() {
  try {
    const latestId = await redis.get('main:briefing:latest');
    if (!latestId) {
      return NextResponse.json({ error: 'no briefing data' }, { status: 404 });
    }

    const raw = await redis.get(`briefing:${latestId}`);
    if (!raw) {
      return NextResponse.json({ error: 'no briefing data' }, { status: 404 });
    }

    const briefing = JSON.parse(raw);

    return NextResponse.json({
      date: briefing.date,
      publishTime: briefing.publishTime,
      globalMacro: briefing.globalMacro,
    });
  } catch {
    return NextResponse.json(
      { error: 'failed to load macro data' },
      { status: 500 }
    );
  }
}
