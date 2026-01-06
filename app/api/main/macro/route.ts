import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis/redis';
import { fetchGlobalIndices } from '@/lib/api/yahooFinance';
import { MacroItem } from '@/types/services';

export async function GET() {
  try {
    // 1. 실시간 지수 데이터 가져오기 (Yahoo Finance 라이브러리 직접 호출)
    const liveIndices = await fetchGlobalIndices();

    // 2. Redis에서 가장 최근에 분석된 AI 코멘트 데이터 가져오기
    const cachedData = await redis.get('dashboard:latest');
    const dashboard = cachedData ? (typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData) : null;
    const cachedMacro = dashboard?.macro || [];

    // 3. 실시간 데이터와 AI 분석 내용 병합
    const macroData = liveIndices.map((live) => {
      // 이전에 분석된 데이터 중 같은 지수 찾기
      const prevAnalysis = cachedMacro.find((m: MacroItem) => m.indexName === live.name);
      return {
        region: live.region,
        indexName: live.name,
        value: live.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        change: `${live.change >= 0 ? '+' : ''}${live.changePercent.toFixed(2)}%`,
        status: live.change >= 0 ? 'positive' : 'negative',
        aiAnalysis: prevAnalysis?.aiAnalysis || '최근 시장 데이터를 분석 중입니다.',
      };
    });

    return NextResponse.json(macroData);
  } catch (error) {
    console.error('Global Macro API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

