import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';

export async function GET() {
  try {
    const latestId = await redis.get('main:strategy:latest');
    if (!latestId) {
      return NextResponse.json({ sectors: [] });
    }

    const raw = await redis.get(`strategy:${latestId}`);
    if (!raw) {
      return NextResponse.json({ sectors: [] });
    }

    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json(
      { error: 'failed to load sector data' },
      { status: 500 }
    );
  }
}
