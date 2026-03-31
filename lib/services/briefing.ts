import { runGeminiJSON } from '@/lib/ai/gemini';
import { buildSectorPrompt } from '@/lib/ai/prompts/sectorBuilder';
import { buildNewsPrompt } from '@/lib/ai/prompts/newsBuilder';
import { buildMarketImpactPrompt } from '@/lib/ai/prompts/impactBuilder';
import { buildObservationPrompt } from '@/lib/ai/prompts/observationBuilder';
import { buildInsightPrompt } from '@/lib/ai/prompts/insightBuilder';
import {
  NewsResponse,
  SectorResponse,
  MarketImpactResponse,
  ObservationResponse,
  InsightResponse,
} from '@/types/services';
import { macroStanceFromChangePercent } from '@/constants/macroStatus';
import { MarketIndexData } from '@/lib/external/yahooFinance';

export type AnalysisTask = 'sector' | 'news' | 'impact' | 'observation' | 'insight';

class AIResponseTooLongError extends Error {
  public readonly task: AnalysisTask;
  public readonly finishReason = 'length';
  public readonly originalError: Error;

  constructor(task: AnalysisTask, originalError: Error) {
    super(
      `AI 응답이 너무 길어 생성이 중단되었습니다 (${task} 섹션). ` +
        `토큰 제한을 초과했거나 응답이 불완전합니다.`
    );
    this.name = 'AIResponseTooLongError';
    this.task = task;
    this.originalError = originalError;
  }
}

// 공통 인터페이스 정의
export interface BriefingInquiry {
  userKeywords: string[];
  marketData: {
    globalIndices: MarketIndexData[];
  };
  newsList: unknown[];
}

export async function performAIAnalysis(inquiry: BriefingInquiry) {
  const { userKeywords, marketData, newsList } = inquiry;

  const runTask = async <T>(task: AnalysisTask, prompt: string): Promise<T> => {
    try {
      const result = await runGeminiJSON(prompt);
      return result as T;
    } catch (err) {
      // 응답이 토큰 제한 등으로 중단된 경우
      if (
        err instanceof Error &&
        (err.message.includes('interrupted') || err.message.includes('length'))
      ) {
        throw new AIResponseTooLongError(task, err);
      }
      throw err;
    }
  };

  // 섹션별 순차 처리 (토큰 제한 문제 방지 및 디버깅 용이)
  console.log('🚀 [Briefing] Starting section-by-section analysis...');

  const sectorRes = await runTask<SectorResponse>('sector', buildSectorPrompt(userKeywords, marketData, newsList));
  console.log('✅ [Briefing] Sector analysis completed');

  const newsRes = await runTask<NewsResponse>('news', buildNewsPrompt(userKeywords, newsList));
  console.log('✅ [Briefing] News analysis completed');

  const impactRes = await runTask<MarketImpactResponse>('impact', buildMarketImpactPrompt(marketData, newsList));
  console.log('✅ [Briefing] Impact analysis completed');

  const observationRes = await runTask<ObservationResponse>('observation', buildObservationPrompt(marketData, newsList));
  console.log('✅ [Briefing] Observation analysis completed');

  const insightRes = await runTask<InsightResponse>('insight', buildInsightPrompt(marketData, newsList));
  console.log('✅ [Briefing] Insight analysis completed');

  // 데이터 취합 로직
  return {
    main: {
      macro: marketData.globalIndices.map((idx) => ({
        region: idx.region,
        indexName: idx.name,
        value: idx.price.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        change: `${idx.changePercent >= 0 ? '+' : ''}${idx.changePercent.toFixed(2)}%`,
        status: macroStanceFromChangePercent(idx.changePercent),
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
