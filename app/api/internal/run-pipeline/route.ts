import { verifyCronAuth } from '@/lib/utils/verifyCronAuth';
import { warmCacheFromLatestBriefing } from '@/lib/utils/warmCache';
import { addBreadcrumb, reportError } from '@/lib/core/sentry';
import { NextRequest, NextResponse } from 'next/server';

async function readSafeBody(res: Response) {
  const text = await res.text();
  const trimmed = text.slice(0, 2000);
  try {
    return { kind: 'json' as const, data: JSON.parse(trimmed) as unknown, raw: trimmed };
  } catch {
    return { kind: 'text' as const, data: trimmed as unknown, raw: trimmed };
  }
}

function getStringField(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const record = obj as Record<string, unknown>;
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

export const POST = verifyCronAuth(async (req: NextRequest) => {
  const host = req.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const results: Record<string, unknown> = {};

  try {
    addBreadcrumb('Pipeline started', 'pipeline', {
      route: '/api/internal/run-pipeline',
    });

    const callStep = async <T extends { success?: boolean }>(
      step: 'collectNews' | 'generateStrategy' | 'generateBriefing',
      path: string
    ): Promise<T> => {
      addBreadcrumb(`Step started: ${step}`, 'pipeline', { path });
      const res = await fetch(`${baseUrl}${path}`, {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      });

      const body = await readSafeBody(res);
      const data = body.data as T;
      const ok = res.ok && (data?.success ?? true) === true;

      if (!ok) {
        const msg =
          getStringField(data, 'error') ??
          getStringField(data, 'message') ??
          `Step ${step} failed`;

        const err = new Error(msg);
        reportError(err, {
          kind: 'pipeline_step_failed',
          step,
          path,
          status: res.status,
          statusText: res.statusText,
          responseBody: body.raw,
        });

        throw err;
      }

      addBreadcrumb(`Step completed: ${step}`, 'pipeline', {
        path,
        status: res.status,
      });
      return data;
    };

    // 1. 뉴스 수집
    console.log('--- Step 1: Collecting News ---');
    const collectData = await callStep<{ 
      success: boolean; 
      message?: string;
      newNewsCount?: number; 
    }>('collectNews', '/api/internal/collect-news');
    results.collectNews = collectData;

    // 새 뉴스가 없으면 AI 분석 단계 스킵 (비용 절감)
    const newNewsCount = collectData.newNewsCount ?? 0;
    if (newNewsCount === 0) {
      console.log('⚠️ [Pipeline] No new news found. Skipping AI analysis steps to save costs.');
      // 스킵 시에도 Redis에 마지막 브리핑으로 워밍 → 대시보드에 데이터 유지
      const warmed = await warmCacheFromLatestBriefing();
      return NextResponse.json({
        success: true,
        message: 'Pipeline completed (no new news, AI analysis skipped)',
        results: {
          ...results,
          generateStrategy: { success: true, skipped: true, reason: 'No new news' },
          generateBriefing: { success: true, skipped: true, reason: 'No new news' },
          warmCache: { success: warmed },
        },
      });
    }

    // 2. 섹터 전략 생성
    console.log('--- Step 2: Generating Strategy ---');
    const strategyData = await callStep<{ success: boolean; error?: string }>(
      'generateStrategy',
      '/api/internal/generate-strategy'
    );
    results.generateStrategy = strategyData;

    // 3. 브리핑 생성 (분석 및 DB 저장)
    console.log('--- Step 3: Generating Briefing ---');
    const briefingData = await callStep<{
      success: boolean;
      error?: string;
      message?: string;
    }>('generateBriefing', '/api/internal/generate-briefing');
    results.generateBriefing = briefingData;

    addBreadcrumb('Pipeline completed', 'pipeline', {
      route: '/api/internal/run-pipeline',
    });
    return NextResponse.json({
      success: true,
      message: 'Pipeline completed successfully',
      results,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Pipeline Error:', error);
    // If the error wasn't already captured as a step failure, capture here with whatever we have.
    reportError(error, {
      kind: 'pipeline_failed',
      route: '/api/internal/run-pipeline',
      resultsSoFar: results,
    });
    return NextResponse.json(
      { success: false, error: errorMessage, results },
      { status: 500 }
    );
  }
});
