import { runGPTJSON } from '@/lib/ai/openai';
import { runGeminiJSON } from '@/lib/ai/gemini';
import { buildMacroPrompt } from '@/lib/prompts/macroBuilder';
import { buildSectorPrompt } from '@/lib/prompts/sectorBuilder';
import { buildNewsPrompt } from '@/lib/prompts/newsBuilder';
import { buildPortfolioPrompt } from '@/lib/prompts/portfolioBuilder';
import {
  MacroResponse,
  NewsResponse,
  PortfolioResponse,
  SectorResponse,
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
    userPortfolio,
  } = inquiry;
  const runAI = modelType === 'gpt' ? runGPTJSON : runGeminiJSON;

  // 병렬 호출
  const [macroRes, sectorRes, newsRes, portfolioRes] = (await Promise.all([
    runAI(buildMacroPrompt(marketData)),
    runAI(buildSectorPrompt(userKeywords, marketData)),
    runAI(buildNewsPrompt(newsList)),
    runAI(buildPortfolioPrompt(userPortfolio, marketData)),
  ])) as [MacroResponse, SectorResponse, NewsResponse, PortfolioResponse];

  // 데이터 취합 로직
  return {
    main: {
      macro: macroRes.macro,
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
      })),
      portfolio: {
        performance: portfolioRes.performance,
        holdings: portfolioRes.holdings,
        strategicSummary: portfolioRes.strategicSummary,
      },
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
