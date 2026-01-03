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
    // 12개 전체 섹터에 대한 시장 상황을 분석하여 DB/Redis에 데이터 확보 (유저 개인화 대응)
    const representativeKeywords = [
      '국내증시', '미국증시', '금리/채권', '환율', 
      '반도체/AI', '이차전지', '바이오', '빅테크', 
      '부동산', '원자재', '가상자산', '소비재'
    ];
    const marketData = {};

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

