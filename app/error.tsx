'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import ErrorState from '@/components/common/ErrorState';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry로 에러 전송
    Sentry.captureException(error);
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-(--background)">
      <ErrorState 
        title="서비스 이용에 불편을 드려 죄송합니다"
        message="시스템 오류가 발생했습니다. 아래 버튼을 눌러 다시 시도하거나 홈으로 이동해주세요."
        onReset={reset}
      />
      {error.digest && (
        <p className="absolute bottom-4 text-[10px] text-slate-400">Error ID: {error.digest}</p>
      )}
    </div>
  );
}
