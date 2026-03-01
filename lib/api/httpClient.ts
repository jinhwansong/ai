import { ApiError } from '@/lib/errors/apiError';
import { logError } from '@/lib/core/errorLogging';
import { defaultRetryPolicy } from './retry';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

const baseUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? '';
const TIMEOUT_MS = 15_000;

/** 쿼리 파라미터 객체를 URL search string으로 변환 (undefined/null 제외) */
export function buildQuery(
  params: Record<string, string | number | boolean | undefined | null> | undefined,
): string {
  if (!params) return '';
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    sp.append(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

function parseErrorPayload(text: string): { code?: string; message: string } {
  try {
    const parsed = text ? JSON.parse(text) : {};
    if (parsed.error && typeof parsed.error === 'object') {
      return {
        code: parsed.error.code,
        message: parsed.error.message ?? 'api 요청실패',
      };
    }
    return {
      message: (parsed.error ?? parsed.message ?? text) || 'api 요청실패',
    };
  } catch {
    return { message: text || 'api 요청실패' };
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function request<T>(
  method: HttpMethod,
  path: string,
  opts?: { query?: Record<string, string | number | undefined | null>; body?: string },
): Promise<T> {
  const url = `${baseUrl().replace(/\/$/, '')}${path}${buildQuery(opts?.query)}`;
  const isIdempotent = method === 'GET' || method === 'DELETE';

  for (let attempt = 0; ; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: opts?.body,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        const { code, message } = parseErrorPayload(text);
        const err = new ApiError(message, {
          kind: 'Http',
          status: res.status,
          url,
          method,
          code,
          payload: text,
        });
        logError(err, { source: 'fetcher', location: url });
        throw err;
      }

      try {
        return (await res.json()) as T;
      } catch {
        throw new ApiError('Failed to parse JSON', {
          kind: 'Parse',
          url,
          method,
        });
      }
    } catch (e) {
      const err =
        e instanceof ApiError
          ? e
          : e instanceof DOMException && e.name === 'AbortError'
            ? new ApiError('요청이 취소되었거나 시간이 초과되었습니다.', {
                kind: 'Timeout',
                url,
                method,
              })
            : new ApiError(
                e instanceof Error ? e.message : '네트워크 오류',
                { kind: 'Network', url, method },
              );

      if (!isIdempotent) {
        logError(err, { source: 'fetcher', location: url });
        throw err;
      }
      const decision = defaultRetryPolicy(err, attempt, { maxRetries: 1 });
      if (!decision.retry) {
        logError(err, { source: 'fetcher', location: url });
        throw err;
      }
      await sleep(decision.delayMs);
    } finally {
      clearTimeout(t);
    }
  }
}

export const apiClient = {
  getBaseUrl: baseUrl,
  get<T>(
    path: string,
    query?: Record<string, string | number | undefined | null>,
  ): Promise<T> {
    return request<T>('GET', path, { query });
  },
  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('POST', path, {
      body: body != null ? JSON.stringify(body) : undefined,
    });
  },
  patch<T>(path: string, body?: unknown): Promise<T> {
    return request<T>('PATCH', path, {
      body: body != null ? JSON.stringify(body) : undefined,
    });
  },
  delete<T>(path: string): Promise<T> {
    return request<T>('DELETE', path);
  },
};
