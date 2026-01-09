import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { getCurrentTimeSlot, getTimeSlotRedisKey } from '@/util/timeSlot';

export async function GET() {
  try {
    const currentSlot = getCurrentTimeSlot();
    const primaryKey = getTimeSlotRedisKey(currentSlot);
    
    let cachedData = await redis.get(primaryKey);
    if (!cachedData) {
      cachedData = await redis.get('dashboard:latest');
    }
    
    if (!cachedData) {
      return NextResponse.json(
        { error: 'No news data found in Redis' },
        { status: 404 }
      );
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    
    // 메인용 데이터 가공
    const news = (dashboard.newsHighlights || [])
      .slice(0, 4)
      .map((item: Record<string, unknown>) => ({
        id: item.id,
        title: item.title,
        summary: item.descriptionShort,
        tags: item.tags,
        published_at: item.published_at,
        source: item.source,
        impact: item.impact,
      }));

      return NextResponse.json({
      news,
      date: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('News API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
