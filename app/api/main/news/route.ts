import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { NewsItem } from '@/types/services';
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
      return NextResponse.json({
        news: [],
        date: new Date().toISOString().split('T')[0],
      });
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const news = (dashboard.newsHighlights || []).slice(0, 4); 

    return NextResponse.json({
      news: news.map((n: NewsItem) => ({
        title: n.title,
        summary: n.descriptionShort,
        tags: n.tags,
        published_at: new Date().toISOString(), // 브리핑 생성 시점 기준
        source: 'AI Analyst',
        impact: n.impact || 'Medium',
      })),
      date: new Date().toISOString().split('T')[0],
    });
  } catch (error) {
    console.error('News API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

