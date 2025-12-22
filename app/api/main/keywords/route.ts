import { redis } from '@/lib/redis/redis';
import { NextResponse } from 'next/server';

const REDIS_KEY = 'main:keywords';

export async function GET() {
  try {
    const cached = await redis.get(REDIS_KEY);

    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    return NextResponse.json({
      keywords: [],
    });
  } catch {
    return NextResponse.json(
      { error: 'failed to load keywords' },
      { status: 500 }
    );
  }
}
