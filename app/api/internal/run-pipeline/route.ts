import { verifyCronAuth } from '@/lib/utils/verifyCronAuth';
import { addBreadcrumb, reportError } from '@/lib/core/sentry';
import { NextRequest, NextResponse } from 'next/server';

async function readSafeBody(res: Response) {
  // Avoid throwing on invalid JSON and avoid leaking large bodies.
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

type PipelineStep = 'collectNews' | 'generateStrategy' | 'generateBriefing';

class PipelineTimeoutError extends Error {
  public readonly step: PipelineStep;
  public readonly timeout = true;
  public readonly timeoutMs: number;

  constructor(step: PipelineStep, timeoutMs: number) {
    super(`${step} 작업이 ${timeoutMs / 1000}초 후 타임아웃되었습니다`);
    this.name = 'PipelineTimeoutError';
    this.step = step;
    this.timeoutMs = timeoutMs;
  }
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
      step: PipelineStep,
      path: string,
      timeoutMs: number = 300000 // 기본 5분, generateBriefing은 더 길게 설정 가능
    ): Promise<T> => {
      addBreadcrumb(`Step started: ${step}`, 'pipeline', { path, timeoutMs });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn(`⏰ [Pipeline] ${step} timed out after ${timeoutMs}ms`);
      }, timeoutMs);

      try {
        const res = await fetch(`${baseUrl}${path}`, {
          headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
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
            // keep response small; never include secrets
            responseBody: body.raw,
          });

          throw err;
        }

        addBreadcrumb(`Step completed: ${step}`, 'pipeline', {
          path,
          status: res.status,
        });
        return data;
      } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new PipelineTimeoutError(step, timeoutMs);
        }

        throw fetchError;
      }
    };
    // 1. 뉴스 수집 (짧은 타임아웃)
    console.log('--- Step 1: Collecting News ---');
    const collectData = await callStep<{ success: boolean; message?: string }>(
      'collectNews',
      '/api/internal/collect-news',
      60000 // 1분
    );
    results.collectNews = collectData;

    // 2. 섹터 전략 생성 (중간 타임아웃)
    console.log('--- Step 2: Generating Strategy ---');
    const strategyData = await callStep<{ success: boolean; error?: string }>(
      'generateStrategy',
      '/api/internal/generate-strategy',
      120000 // 2분
    );
    results.generateStrategy = strategyData;

    // 3. 브리핑 생성 (긴 타임아웃 - AI 분석이 많이 필요함)
    console.log('--- Step 3: Generating Briefing ---');
    const briefingData = await callStep<{
      success: boolean;
      error?: string;
      message?: string;
    }>('generateBriefing', '/api/internal/generate-briefing', 600000); // 10분
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
