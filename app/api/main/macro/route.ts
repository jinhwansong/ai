import { NextResponse } from 'next/server';
import { apiError } from '@/lib/errors/apiResponse';
import { redis } from '@/lib/core/redis';
import { fetchGlobalIndices, MarketIndexData } from '@/lib/external/yahooFinance';
import { MacroItem } from '@/types/services';
import {
  REDIS_KEY_DASHBOARD_LATEST,
  REDIS_KEY_MARKET_INDICES_LIVE,
  REDIS_TTL_MARKET_INDICES_SEC,
} from '@/lib/constants/redisKeys';

export async function GET() {
  try {
    // 1. Redis에서 캐시된 실시간 지수 데이터 확인
    let liveIndices;
    const cachedIndices = await redis.get(REDIS_KEY_MARKET_INDICES_LIVE);
    
    if (cachedIndices) {
      // 캐시가 있으면 사용 (네트워크 절약)
      liveIndices = typeof cachedIndices === 'string' ? JSON.parse(cachedIndices) : cachedIndices;
    } else {
      // 캐시가 없으면 Yahoo Finance에서 가져와서 캐시에 저장
      liveIndices = await fetchGlobalIndices();
      await redis.set(
        REDIS_KEY_MARKET_INDICES_LIVE,
        JSON.stringify(liveIndices),
        'EX',
        REDIS_TTL_MARKET_INDICES_SEC
      );
    }

    // 2. Redis에서 가장 최근에 분석된 AI 코멘트 데이터 가져오기
    const cachedData = await redis.get(REDIS_KEY_DASHBOARD_LATEST);
    const dashboard = cachedData ? (typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData) : null;
    const cachedMacro = dashboard?.macro || [];

    // 3. 실시간 데이터와 AI 분석 내용 병합
    const macroData = liveIndices.map((live: MarketIndexData) => {
      // 이전에 분석된 데이터 중 같은 지수 찾기
      const prevAnalysis = cachedMacro.find((m: MacroItem) => m.indexName === live.name);
      return {
        region: live.region,
        indexName: live.name,
        value: live.price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        change: `${live.change >= 0 ? '+' : ''}${live.changePercent.toFixed(2)}%`,
        status: live.change >= 0 ? 'positive' : 'negative',
        aiAnalysis: prevAnalysis?.aiAnalysis || '최근 시장 데이터를 분석 중입니다.',
      };
    });

    return NextResponse.json(macroData);
  } catch (error) {
    console.error('Global Macro API Error:', error);
    return apiError('Internal Server Error', 500);
  }
}
