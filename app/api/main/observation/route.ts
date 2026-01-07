import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { ObservationItem } from '@/types/services';

export async function GET() {
  try {
    // Redis에서 가장 최근에 분석된 브리핑 데이터 가져오기
    const cachedData = await redis.get('dashboard:latest');

    if (!cachedData) {
      return NextResponse.json(
        { error: 'No observation data found in Redis' },
        { status: 404 }
      );
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const observations: ObservationItem[] = dashboard.observations || [
      {
        symbol: 'NVDA',
        name: '엔비디아',
        type: 'Stock',
        reason: 'AI 칩 수요 지속 및 차세대 블랙웰 칩 출시 기대감으로 강력한 모멘텀 형성',
        tags: ['AI반도체', '실적기대', '블랙웰'],
        momentum: 'Strong'
      },
      {
        symbol: 'SOXX',
        name: 'iShares Semiconductor ETF',
        type: 'ETF',
        reason: '글로벌 반도체 업황 회복세와 필라델피아 반도체 지수 강세에 따른 수혜',
        tags: ['반도체섹터', '지수추종', '글로벌'],
        momentum: 'Moderate'
      },
      {
        symbol: 'TSM',
        name: 'TSMC',
        type: 'Stock',
        reason: '2나노 공정 양산 준비 및 글로벌 파운드리 시장 점유율 확대로 안정적 성장세',
        tags: ['파운드리', '2나노', '독점력'],
        momentum: 'Building'
      }
    ];

    return NextResponse.json(observations);
  } catch (error) {
    console.error('Observation API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

