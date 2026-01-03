import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';

export async function GET() {
  try {
    // Redis에서 가장 최근에 분석된 브리핑 데이터 가져오기
    const cachedData = await redis.get('dashboard:latest');

    if (!cachedData) {
      return NextResponse.json(
        { error: 'No portfolio data found in Redis' },
        { status: 404 }
      );
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const portfolio = dashboard.portfolio;

    if (!portfolio) {
      return NextResponse.json(
        { error: 'No portfolio data found in dashboard' },
        { status: 404 }
      );
    }

    // Major Holdings를 5개로 고정
    if (portfolio.holdings) {
      portfolio.holdings = portfolio.holdings.slice(0, 5);
    }

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Portfolio API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

