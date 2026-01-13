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

type RawNewsRow = {
  uuid?: string | null;
  title?: string | null;
  description?: string | null;
  content?: string | null;
  source?: string | null;
  url?: string | null;
  published_at?: string | null;
};

function truncateText(input: unknown, maxLen: number): string | null {
  if (typeof input !== 'string') return null;
  const s = input.trim();
  if (!s) return null;
  if (s.length <= maxLen) return s;
  return `${s.slice(0, Math.max(0, maxLen - 1))}…`;
}

function compactNewsForPrompt(rows: RawNewsRow[]) {
  // Keep only fields that help analysis; aggressively truncate to avoid token blowups.
  // This is critical because OpenAI JSON mode will fail if output is cut off (finish_reason=length).
  return rows.map((r) => ({
    uuid: r.uuid ?? null,
    published_at: r.published_at ?? null,
    source: truncateText(r.source, 80),
    title: truncateText(r.title, 180),
    description: truncateText(r.description ?? r.content, 320),
    url: r.url ?? null,
  }));
}

export const GET = verifyCronAuth(async () => {
  try {
    // 뉴스 데이터 가져오기
    const { data: rawNews } = await supabase
      .from('raw_news')
      // select('*') can explode prompt tokens (content/image/etc). Keep it lean for strategy generation.
      .select('uuid,title,description,content,source,url,published_at')
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

    const prompt = buildSectorPrompt(
      ANALYSIS_KEYWORDS,
      marketData,
      compactNewsForPrompt((rawNews || []) as RawNewsRow[])
    );

    const run = async (model: StrategyModel) =>
      model === 'gpt'
        ? runGPTJSON(prompt, { maxTokens: 2000, tag: 'generate-strategy' })
        : runGeminiJSON(prompt);

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
    console.error('Generate Strategy Error:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}); 

