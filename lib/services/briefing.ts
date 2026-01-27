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
  modelType?: AIModelType;
  modelPlan?: Partial<Record<AnalysisTask, AIModelType>>;
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

  const runJSON = (model: AIModelType, prompt: string, opts?: { maxTokens?: number }) =>
    model === 'gpt' ? runGPTJSON(prompt, { maxTokens: opts?.maxTokens }) : runGeminiJSON(prompt);

  const getModelForTask = (task: AnalysisTask): AIModelType =>
    modelPlan?.[task] ?? modelType;

  const getFallbackModel = (primary: AIModelType): AIModelType =>
    fallbackModel ?? (primary === 'gpt' ? 'gemini' : 'gpt');

  const runTask = async <T>(task: AnalysisTask, prompt: string): Promise<T> => {
    const primary = getModelForTask(task);
    // 복잡한 분석 작업들은 훨씬 더 큰 토큰 제한 필요
    const needsMoreTokens = ['impact', 'observation', 'insight'].includes(task);
    const opts = needsMoreTokens ? { maxTokens: 3000 } : { maxTokens: 1500 }; // 비용 절감: 4000→3000, 2000→1500

    try {
      const result = await runJSON(primary, prompt, opts);
      return result as T;
    } catch (err) {
      // finish_reason이 length인 경우 더 명확한 에러 메시지
      if (err instanceof Error && err.message.includes('GPT response was interrupted')) {
        throw new AIResponseTooLongError(task, err);
      }

      const fallback = getFallbackModel(primary);
      // 같은 모델로의 fallback은 의미 없으니 그대로 throw
      if (fallback === primary) throw err;

      console.log(`🔄 [${task}] Primary model failed, trying fallback: ${primary} → ${fallback}`);
      return (await runJSON(fallback, prompt, opts)) as T;
    }
  };

  // 섹션별 순차 처리 (토큰 제한 문제 방지 및 디버깅 용이)
  console.log('🚀 [Briefing] Starting section-by-section analysis...');

  const sectorRes = await runTask<SectorResponse>('sector', buildSectorPrompt(userKeywords, marketData, newsList));
  console.log('✅ [Briefing] Sector analysis completed');

  const newsRes = await runTask<NewsResponse>('news', buildNewsPrompt(newsList));
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
