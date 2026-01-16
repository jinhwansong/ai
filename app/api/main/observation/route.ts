import { NextResponse } from 'next/server';
import { redis } from '@/lib/core/redis';
import { ObservationItem } from '@/types/services';
import { getCurrentTimeSlot, getTimeSlotRedisKey } from '@/lib/utils/timeSlot';

export async function GET() {
  try {
    // 현재 한국 시간 기준 시간대 결정
    const currentSlot = getCurrentTimeSlot();
    const primaryKey = getTimeSlotRedisKey(currentSlot);
    
    // 시간대별 데이터 우선, 없으면 fallback
    let cachedData = await redis.get(primaryKey);
    if (!cachedData) {
      cachedData = await redis.get('dashboard:latest');
    }

    if (!cachedData) {
      return NextResponse.json(
        { error: 'No observation data found in Redis' },
        { status: 404 }
      );
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const observations: ObservationItem[] = dashboard.observations
    console.log(observations[0].relatedNews);
    return NextResponse.json(observations);
  } catch (error) {
    console.error('Observation API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

