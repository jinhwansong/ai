import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';

export async function GET() {
  try {
    const latestId = await redis.get('main:briefing:latest');
    if (!latestId) {
      return NextResponse.json(
        { error: '오늘의 데일리 브리핑 준비 중' },
        { status: 404 }
      );
    }

    const raw = await redis.get(`briefing:${latestId}`);
    if (!raw) {
      return NextResponse.json(
        { error: '오늘의 데일리 브리핑 준비 중' },
        { status: 404 }
      );
    }

    const briefing = JSON.parse(raw);

    return NextResponse.json({
      date: briefing.date,
      publishTime: briefing.publishTime,
      title: briefing.title,
      summary: briefing.summary,
      briefingId: briefing.id,
    });
  } catch {
    return NextResponse.json(
      { error: 'failed to load briefing' },
      { status: 500 }
    );
  }
}
