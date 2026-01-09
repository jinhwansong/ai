import { runGPTJSON } from '@/lib/ai/openai';
import { runGeminiJSON } from '@/lib/ai/gemini';
import { buildSectorPrompt } from '@/lib/prompts/sectorBuilder';
import { buildNewsPrompt } from '@/lib/prompts/newsBuilder';
import { buildMarketImpactPrompt } from '@/lib/prompts/impactBuilder';
import { buildObservationPrompt } from '@/lib/prompts/observationBuilder';
import { buildInsightPrompt } from '@/lib/prompts/insightBuilder';
import {
  NewsResponse,
  SectorResponse,
  MarketImpactResponse,
  ObservationResponse,
  InsightResponse,
} from '@/types/services';
import { MarketIndexData } from '@/lib/api/yahooFinance';

// 공통 인터페이스 정의
export interface BriefingInquiry {
  modelType?: 'gpt' | 'gemini';
  userKeywords: string[];
  marketData: {
    globalIndices: MarketIndexData[];
  };
  newsList: unknown[];
}

export async function performAIAnalysis(inquiry: BriefingInquiry) {
  const {
    modelType = 'gemini',
    userKeywords,
    marketData,
    newsList,
  } = inquiry;
  const runAI = modelType === 'gpt' ? runGPTJSON : runGeminiJSON;

  // 병렬 호출
  const [sectorRes, newsRes, impactRes, observationRes, insightRes] = (await Promise.all([
    runAI(buildSectorPrompt(userKeywords, marketData, newsList)),
    runAI(buildNewsPrompt(newsList)),
    runAI(buildMarketImpactPrompt(marketData, newsList)),
    runAI(buildObservationPrompt(marketData, newsList)),
    runAI(buildInsightPrompt(marketData, newsList)),
  ])) as [SectorResponse, NewsResponse, MarketImpactResponse, ObservationResponse, InsightResponse];

  // 데이터 취합 로직
  return {
    main: {
      macro: marketData.globalIndices.map((idx) => ({
        region: idx.region,
        indexName: idx.name,
        value: idx.price.toLocaleString(),
        change: `${idx.changePercent >= 0 ? '+' : ''}${idx.changePercent.toFixed(2)}%`,
        status:
          idx.changePercent > 0.5
            ? 'positive'
            : idx.changePercent < -0.5
            ? 'negative'
            : idx.changePercent < 0
            ? 'cautious'
            : 'neutral',
        aiAnalysis:
          idx.changePercent > 0
            ? '상승 흐름을 보이고 있습니다.'
            : idx.changePercent < 0
            ? '조정 또는 하락세를 나타내고 있습니다.'
            : '현재 보합권에서 등락 중입니다.',
      })),
      signal: {
        focus: impactRes.focus,
        description: impactRes.description,
        value: impactRes.score.toString(),
        change: impactRes.direction,
        impactZones: impactRes.zones,
        tags: impactRes.tags,
      },
      observations: observationRes.observations,
      insight: {
        summary: insightRes.summary,
      },
      sectorSummary: sectorRes.sectors.map((s) => ({
        name: s.name,
        signal: s.signal,
        focus: s.focus,
        momentum: s.momentum,
      })),
      newsHighlights: newsRes.news.map((n) => ({
        title: n.title,
        descriptionShort: n.descriptionShort,
        contentLong: n.contentLong,
        checkpoints: n.checkpoints || [],
        impact: n.impact,
        tags: n.tags,
        relatedSectors: n.relatedSectors,
        url: n.url,
        source: n.source || (n.url ? new URL(n.url).hostname.replace('www.', '') : 'AI분석'),
      })),
    },
    detail: {
      sectorDetails: sectorRes.sectors.map((s) => ({
        name: s.name,
        descriptionLong: s.descriptionLong,
      })),
      newsDetails: newsRes.news.map((n) => ({
        title: n.title,
        contentLong: n.contentLong,
        checkpoints: n.checkpoints || [],
      })),
    },
  };
}
