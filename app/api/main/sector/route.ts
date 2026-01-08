import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { SectorItem } from '@/types/services';
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
        { error: 'No briefing data found in Redis' },
        { status: 404 }
      );
    }

    const dashboard = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    const sectors: SectorItem[] = dashboard.sectorSummary || [];
    const newsHighlights: { relatedSectors?: string[]; impact?: string }[] = dashboard.newsHighlights || [];

    // 1. 뉴스 연관도 계산 (뉴스의 relatedSectors에 포함된 횟수)
    const sectorNewsCount: Record<string, number> = {};
    newsHighlights.forEach(news => {
      news.relatedSectors?.forEach((sName: string) => {
        sectorNewsCount[sName] = (sectorNewsCount[sName] || 0) + (news.impact === 'High' ? 2 : 1);
      });
    });

    // 2. 점수화 및 정렬
    const scoredSectors = sectors.map(s => {
      let score = 0;
      // Momentum 점수 (Strong: 3, Moderate: 2, Building: 1)
      if (s.momentum === 'Strong') score += 3;
      else if (s.momentum === 'Moderate') score += 2;
      else if (s.momentum === 'Building') score += 1;

      // Stance 점수 (POSITIVE: 2, WATCHING/NEUTRAL: 1, NEGATIVE: 0)
      if (s.signal === 'POSITIVE') score += 2;
      else if (s.signal === 'NEGATIVE') score -= 1;

      // 뉴스 연관도 가중치
      score += (sectorNewsCount[s.name] || 0) * 1.5;

      return { ...s, totalScore: score };
    });

    // 3. 상위 4개 선별
    const topSectors = scoredSectors
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 4);

    const formattedData = {
      date: new Date().toISOString().split('T')[0],
      items: topSectors.map((s) => ({
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

