import { runGPTJSON } from '@/lib/ai/openai';
import { runGeminiJSON } from '@/lib/ai/gemini';
import { buildMacroPrompt } from '@/lib/prompts/macroBuilder';
import { buildSectorPrompt } from '@/lib/prompts/sectorBuilder';
import { buildNewsPrompt } from '@/lib/prompts/newsBuilder';
import { buildMarketImpactPrompt } from '@/lib/prompts/impactBuilder';
import { buildObservationPrompt } from '@/lib/prompts/observationBuilder';
import { buildInsightPrompt } from '@/lib/prompts/insightBuilder';
import {
  MacroResponse,
  NewsResponse,
  SectorResponse,
  MarketImpactResponse,
  ObservationResponse,
  InsightResponse,
} from '@/types/services';

// 공통 인터페이스 정의
export interface BriefingInquiry {
  modelType?: 'gpt' | 'gemini';
  userKeywords: string[];
  marketData: Record<string, unknown>;
  newsList: unknown[];
  userPortfolio: Record<string, unknown>;
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
  const [macroRes, sectorRes, newsRes, impactRes, observationRes, insightRes] = (await Promise.all([
    runAI(buildMacroPrompt(marketData)),
    runAI(buildSectorPrompt(userKeywords, marketData)),
    runAI(buildNewsPrompt(newsList)),
    runAI(buildMarketImpactPrompt(marketData, newsList)),
    runAI(buildObservationPrompt(marketData, newsList)),
    runAI(buildInsightPrompt(marketData, newsList)),
  ])) as [MacroResponse, SectorResponse, NewsResponse, MarketImpactResponse, ObservationResponse, InsightResponse];

  // 데이터 취합 로직
  return {
    main: {
      macro: macroRes.macro,
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
        impact: n.impact,
        tags: n.tags,
        relatedSectors: n.relatedSectors,
        time: n.time,
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
      })),
    },
  };
}
