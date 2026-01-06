import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const host = req.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const results: Record<string, unknown> = {};

  try {
    // 1. 뉴스 수집
    console.log('--- Step 1: Collecting News ---');
    const collectRes = await fetch(`${baseUrl}/api/internal/collect-news`, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    const collectData = (await collectRes.json()) as { success: boolean };
    results.collectNews = collectData;
    if (!collectData.success) throw new Error('News collection failed');

    // 2. 섹터 전략 생성
    console.log('--- Step 2: Generating Strategy ---');
    const strategyRes = await fetch(`${baseUrl}/api/internal/generate-strategy`, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    const strategyData = (await strategyRes.json()) as { success: boolean };
    results.generateStrategy = strategyData;
    if (!strategyData.success) throw new Error('Strategy generation failed');

    // 3. 브리핑 생성 (분석 및 DB 저장)
    console.log('--- Step 3: Generating Briefing ---');
    const briefingRes = await fetch(`${baseUrl}/api/internal/generate-briefing`, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    const briefingData = (await briefingRes.json()) as { success: boolean };
    results.generateBriefing = briefingData;
    if (!briefingData.success) throw new Error('Briefing generation failed');

    return NextResponse.json({
      success: true,
      message: 'Pipeline completed successfully',
      results,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Pipeline Error:', error);
    return NextResponse.json(
      { success: false, error: errorMessage, results },
      { status: 500 }
    );
  }
}
