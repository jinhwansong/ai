import {  NextResponse } from 'next/server';
import { runGeminiJSON } from '@/lib/ai/gemini';
import { buildSectorPrompt } from '@/lib/prompts/sectorBuilder';
import { redis } from '@/lib/redis/redis';
import { ANALYSIS_KEYWORDS } from '@/contact/keyword';
import { verifyCronAuth } from '@/util/verifyCronAuth';

export const GET = verifyCronAuth(async () => {
  try {
    const marketData = {};

    const sectorRes = await runGeminiJSON(
      buildSectorPrompt(ANALYSIS_KEYWORDS, marketData)
    );

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

