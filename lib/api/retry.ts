import { ApiError } from '@/lib/errors/apiError';

export type RetryDecision = {
  retry: boolean;
  delayMs: number;
};

export function defaultRetryPolicy(
  error: unknown,
  attempt: number,
  opts?: { maxRetries?: number }
): RetryDecision {
  const maxRetries = opts?.maxRetries ?? 1;
  if (attempt >= maxRetries) return { retry: false, delayMs: 0 };

  if (!(error instanceof ApiError)) return { retry: false, delayMs: 0 };
  if (!error.isRetryable) return { retry: false, delayMs: 0 };

  return { retry: true, delayMs: backoff(attempt) };
}

function backoff(attempt: number) {
  const base = 300 * Math.pow(3, attempt);
  const jitter = Math.floor(Math.random() * 200);
  return base + jitter;
}
