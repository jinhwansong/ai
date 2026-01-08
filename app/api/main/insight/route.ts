import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { getCurrentTimeSlot, getTimeSlotRedisKey } from '@/util/timeSlot';

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
        { error: 'No insight data found in Redis' },
        { status: 404 }
      );
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const insight = dashboard.insight;

    const insightData = {
      summary: insight?.summary || '반도체 수출 호조와 연준의 비둘기파적 발언으로 국내 증시의 단기 반등 모멘텀이 강화되고 있습니다.',
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(insightData);
  } catch (error) {
    console.error('Insight API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

