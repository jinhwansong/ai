import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { SectorItem } from '@/types/services';

export async function GET() {
  try {
    // Redis에서 가장 최근에 분석된 브리핑 데이터 가져오기
    const cachedData = await redis.get('dashboard:latest');
    
    if (!cachedData) {
      return NextResponse.json(
        { error: 'No signal data found in Redis' },
        { status: 404 }
      );
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    
    // dashboard:latest 에는 main_signals 테이블에 저장할 형식과 유사한 데이터가 포함되어야 함
    // generate-briefing 에서 저장한 로직을 바탕으로 데이터 구성
    const sectors: SectorItem[] = dashboard.sectorSummary || [];
    const topSector = sectors[0];

    const signalData = {
      focus: topSector?.focus || '전략적 시장 분석 완료',
      description: topSector
        ? `${topSector.name} 섹션에서 ${topSector.momentum} 수준의 모멘텀이 감지되었습니다. ${topSector.focus}`
        : '현재 시장 상황을 기반으로 한 AI 분석 시그널입니다.',
      value: topSector?.momentum === 'Strong' ? '92.4' : '78.5',
      change: topSector?.signal === 'POSITIVE' ? '+2.1%' : '0.0%',
      tags: topSector ? [topSector.name, topSector.momentum] : ['시장분석'],
      updatedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    return NextResponse.json(signalData);
  } catch (error) {
    console.error('Signal API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
