import { runGeminiJSON } from '@/lib/ai/gemini';
import { runGPTJSON } from '@/lib/ai/openai';
import { buildSectorPrompt } from '@/lib/ai/prompts/sectorBuilder';
import { redis } from '@/lib/core/redis';
import { ANALYSIS_KEYWORDS } from '@/constants/keyword';
import { verifyCronAuth } from '@/lib/utils/verifyCronAuth';
import { fetchGlobalIndices } from '@/lib/external/yahooFinance';
import { reportError } from '@/lib/core/sentry';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

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
  return rows.map((r) => ({
    uuid: r.uuid ?? null,
    published_at: r.published_at ?? null,
    source: truncateText(r.source, 50), // 80 → 50
    title: truncateText(r.title, 150), // 180 → 150
    description: truncateText(r.description ?? r.content, 200), // 320 → 200
    url: r.url ?? null,
  }));
}

export const GET = verifyCronAuth(async () => {
  try {
    // 최근 2시간 이내에 추가된 새 뉴스만 가져오기 (비용 절감)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    
    const { data: rawNews } = await supabase
      .from('raw_news')
      .select('uuid,title,description,content,source,url,published_at')
      .gte('created_at', twoHoursAgo) // 최근 2시간 이내 추가된 뉴스만
      .order('published_at', { ascending: false })
      .limit(20); // 30 → 20 (비용 절감)

    // 새 뉴스가 없으면 스킵
    if (!rawNews || rawNews.length === 0) {
      console.log('⚠️ [Generate Strategy] No new news found in the last 2 hours. Skipping.');
      return NextResponse.json({
        success: true,
        message: 'No new news to analyze (skipped)',
        skipped: true,
      });
    }

    console.log(`📊 [Generate Strategy] Analyzing ${rawNews.length} new news items`);

    const globalIndices = await fetchGlobalIndices();
    const marketData = { globalIndices };

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
        ? runGPTJSON(prompt, { maxTokens: 1500, tag: 'generate-strategy' }) // 2000 → 1500
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
    reportError(error, { route: '/api/internal/generate-strategy' });
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}); 

