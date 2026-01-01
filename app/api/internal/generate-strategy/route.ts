import { NextResponse } from 'next/server';
import { runGeminiJSON } from '@/lib/ai/gemini';
import { buildSectorPrompt } from '@/lib/prompts/sectorBuilder';
import { redis } from '@/lib/redis/redis';

export async function GET(req: Request) {
  // 공통 보안 사항: Cron Secret 검증
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 주요 섹터별 매크로 상황을 분석하여 전략 데이터 갱신
    // 비로그인 기반이므로 대표 섹터 키워드들을 사용
    const representativeKeywords = ['반도체', '배터리', 'AI', '인프라', '금리'];
    const marketData = {}; // TODO: 실시간 매크로 지표 데이터 연동 시 보완

    const sectorRes = await runGeminiJSON(
      buildSectorPrompt(representativeKeywords, marketData)
    );

    // Redis 저장: 섹터별 상세 전략 정보 업데이트
    await redis.set('strategy:latest', JSON.stringify(sectorRes.sectors));

    return NextResponse.json({ 
      success: true, 
      message: 'Sector strategy data refreshed and stored in Redis successfully' 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Generate Strategy Error:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

