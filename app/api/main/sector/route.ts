import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { SectorItem } from '@/types/services';

export async function GET() {
  try {
    // Redis에서 가장 최근에 분석된 브리핑 데이터 가져오기 (dashboard:latest)
    const cachedData = await redis.get('dashboard:latest');

    if (!cachedData) {
      return NextResponse.json(
        { error: 'No briefing data found in Redis' },
        { status: 404 }
      );
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const sectors = dashboard.sectorSummary || [];

    const formattedData = {
      date: new Date().toISOString().split('T')[0],
      items: sectors.map((s: SectorItem) => ({
        type: 'sector',
        name: s.name,
        stance: s.signal, 
        label: s.momentum,
        reason: s.focus,
        guide: s.signal === 'POSITIVE' ? '비중 확대 유지' : '관망 후 대응'
      }))
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Sector Strategy API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

