import {  NextResponse } from 'next/server';
import { runGeminiJSON } from '@/lib/ai/gemini';
import { runGPTJSON } from '@/lib/ai/openai';
import { buildSectorPrompt } from '@/lib/prompts/sectorBuilder';
import { redis } from '@/lib/redis/redis';
import { ANALYSIS_KEYWORDS } from '@/contact/keyword';
import { verifyCronAuth } from '@/util/verifyCronAuth';
import { supabase } from '@/lib/supabase';
import { fetchGlobalIndices } from '@/lib/api/yahooFinance';

type StrategyModel = 'gemini' | 'gpt';

function normalizeStrategyModel(value: string | undefined): StrategyModel | undefined {
  if (!value) return undefined;
  const v = value.trim().toLowerCase();
  if (v === 'gemini' || v === 'gpt') return v;
  return undefined;
}

export const GET = verifyCronAuth(async () => {
  try {
    // 뉴스 데이터 가져오기
    const { data: rawNews } = await supabase
      .from('raw_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(30);

    const globalIndices = await fetchGlobalIndices();
    const marketData = { globalIndices };

    // 모델 선택(환경변수로 제어)
    // - AI_STRATEGY_MODEL: 'gemini' | 'gpt' (default: gemini)
    // - AI_STRATEGY_FALLBACK_MODEL: 'gemini' | 'gpt' (default: opposite model)
    const preferred = normalizeStrategyModel(process.env.AI_STRATEGY_MODEL) ?? 'gemini';
    const fallback =
      normalizeStrategyModel(process.env.AI_STRATEGY_FALLBACK_MODEL) ??
      (preferred === 'gpt' ? 'gemini' : 'gpt');

    const prompt = buildSectorPrompt(ANALYSIS_KEYWORDS, marketData, rawNews || []);

    const run = async (model: StrategyModel) =>
      model === 'gpt' ? runGPTJSON(prompt) : runGeminiJSON(prompt);

    const canUseOpenAI = Boolean(process.env.OPENAI_API_KEY);
    const primaryModel: StrategyModel =
      preferred === 'gpt' && !canUseOpenAI ? 'gemini' : preferred;

    const sectorRes = await run(primaryModel).catch(async (err) => {
      const fb: StrategyModel =
        fallback === 'gpt' && !canUseOpenAI ? 'gemini' : fallback;
      if (fb === primaryModel) throw err;
      return await run(fb);
    });

    // Redis 저장: 섹터별 상세 전략 정보 업데이트
    await redis.set('strategy:latest', JSON.stringify(sectorRes.sectors));

    return NextResponse.json({
      success: true,
      message:
        'Sector strategy data refreshed and stored in Redis successfully',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    // console.error('Generate Strategy Error:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}); 

