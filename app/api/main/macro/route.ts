import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { MacroItem } from '@/types/services';

export async function GET() {
  try {
    // Redis에서 가장 최근에 분석된 브리핑 데이터 가져오기
    const cachedData = await redis.get('dashboard:latest');

    if (!cachedData) {
      return NextResponse.json([]);
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const macroData = (dashboard.macro || []).map((m: MacroItem) => ({
      region: m.region,
      indexName: m.indexName,
      value: m.value,
      change: m.change,
      status: m.status.toLowerCase(),
    }));

    return NextResponse.json(macroData);
  } catch (error) {
    console.error('Global Macro API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

