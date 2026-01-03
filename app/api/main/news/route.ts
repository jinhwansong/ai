import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { NewsItem } from '@/types/services';

export async function GET() {
  try {
    // Redis에서 가장 최근에 분석된 브리핑 데이터 가져오기
    const cachedData = await redis.get('dashboard:latest');

    if (!cachedData) {
      return NextResponse.json({
        news: [],
        date: new Date().toISOString().split('T')[0],
      });
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const news = (dashboard.newsHighlights || []).slice(0, 6); // 6개로 고정

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

