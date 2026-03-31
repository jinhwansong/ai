import { NextResponse } from 'next/server';
import { apiError } from '@/lib/errors/apiResponse';
import { redis } from '@/lib/core/redis';
import { ObservationItem } from '@/types/services';
import { getCurrentTimeSlot, getTimeSlotRedisKey } from '@/lib/utils/timeSlot';
import { REDIS_KEY_DASHBOARD_LATEST } from '@/lib/constants/redisKeys';

export async function GET() {
  try {
    // 현재 한국 시간 기준 시간대 결정
    const currentSlot = getCurrentTimeSlot();
    const primaryKey = getTimeSlotRedisKey(currentSlot);
    
    // 시간대별 데이터 우선, 없으면 fallback
    let cachedData = await redis.get(primaryKey);
    if (!cachedData) {
      cachedData = await redis.get(REDIS_KEY_DASHBOARD_LATEST);
    }

    if (!cachedData) {
      return apiError('No observation data found in Redis', 404, 'NOT_FOUND');
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const observations: ObservationItem[] = dashboard.observations || [];
    return NextResponse.json(observations);
  } catch (error) {
    console.error('Observation API Error:', error);
    return apiError('Internal Server Error', 500);
  }
}

