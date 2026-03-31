'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import ErrorState from '@/components/ui/ErrorState';

export default function AnalysisError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <ErrorState
        title="분석 페이지를 불러오지 못했습니다"
        message="데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요."
        error={error}
        onReset={reset}
      />
    </div>
  );
}
