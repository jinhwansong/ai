import { ApiError } from '@/lib/errors/apiError';
import { reportError } from './sentry';

export type ErrorLogContext = {
  source: 'fetcher' | 'section' | 'page' | 'api' | 'pipeline';
  location?: string;
  [key: string]: unknown;
};

/** Sentry 전송 여부 판단 (노이즈 감소) */
export function shouldReportToSentry(
  error: unknown,
  context: ErrorLogContext
): boolean {
  if (error instanceof ApiError) {
    if (
      error.kind === 'Http' &&
      error.status &&
      error.status >= 400 &&
      error.status < 500
    ) {
      return error.status === 429;
    }
    return true;
  }
  return true;
}

/** 표준화된 에러 로깅 */
export function logError(error: unknown, context: ErrorLogContext) {
  const report = shouldReportToSentry(error, context);
  if (report) {
    reportError(error, {
      ...context,
      ...(error instanceof ApiError && {
        kind: error.kind,
        status: error.status,
        url: error.url,
      }),
    });
  }
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error]', error, context);
  }
}
