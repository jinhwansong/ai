import { runGPTJSON } from '@/lib/ai/openai';
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
import { MarketIndexData } from '@/lib/external/yahooFinance';

export type AIModelType = 'gpt' | 'gemini';
export type AnalysisTask = 'sector' | 'news' | 'impact' | 'observation' | 'insight';

// 공통 인터페이스 정의
export interface BriefingInquiry {
  /**
   * 기존 방식(호환 유지): 전체 분석을 하나의 모델로 실행
   * - 기본값: 'gemini'
   */
  modelType?: AIModelType;

  /**
   * 분리 방식: 분석 영역별로 모델 지정
   * - 지정하지 않은 영역은 modelType(기본 'gemini')를 따릅니다.
   *
   * 예)
   * { news: 'gemini', impact: 'gpt', insight: 'gpt' }
   */
  modelPlan?: Partial<Record<AnalysisTask, AIModelType>>;

  /**
   * 1차 모델이 실패했을 때 1회 리트라이할 fallback 모델
   * - 미지정이면 "반대 모델"로 1회 리트라이합니다.
   */
  fallbackModel?: AIModelType;

  userKeywords: string[];
  marketData: {
    globalIndices: MarketIndexData[];
  };
  newsList: unknown[];
}

export async function performAIAnalysis(inquiry: BriefingInquiry) {
  const {
    modelType = 'gemini',
    modelPlan,
    fallbackModel,
    userKeywords,
    marketData,
    newsList,
  } = inquiry;

  const runJSON = (model: AIModelType, prompt: string) =>
    model === 'gpt' ? runGPTJSON(prompt) : runGeminiJSON(prompt);

  const getModelForTask = (task: AnalysisTask): AIModelType =>
    modelPlan?.[task] ?? modelType;

  const getFallbackModel = (primary: AIModelType): AIModelType =>
    fallbackModel ?? (primary === 'gpt' ? 'gemini' : 'gpt');

  const runTask = async <T>(task: AnalysisTask, prompt: string): Promise<T> => {
    const primary = getModelForTask(task);
    try {
      return (await runJSON(primary, prompt)) as T;
    } catch (err) {
      const fallback = getFallbackModel(primary);
      // 같은 모델로의 fallback은 의미 없으니 그대로 throw
      if (fallback === primary) throw err;
      return (await runJSON(fallback, prompt)) as T;
    }
  };

  // 병렬 호출
  const [sectorRes, newsRes, impactRes, observationRes, insightRes] = (await Promise.all([
    runTask<SectorResponse>('sector', buildSectorPrompt(userKeywords, marketData, newsList)),
    runTask<NewsResponse>('news', buildNewsPrompt(newsList)),
    runTask<MarketImpactResponse>('impact', buildMarketImpactPrompt(marketData, newsList)),
    runTask<ObservationResponse>('observation', buildObservationPrompt(marketData, newsList)),
    runTask<InsightResponse>('insight', buildInsightPrompt(marketData, newsList)),
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
