import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';

export async function GET() {
  try {
    // Redis에서 가장 최근에 분석된 브리핑 데이터 가져오기
    const cachedData = await redis.get('dashboard:latest');

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

