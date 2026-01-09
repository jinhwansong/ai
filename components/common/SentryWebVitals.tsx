'use client';
import { useReportWebVitals } from 'next/web-vitals';
import * as Sentry from '@sentry/nextjs';

/**
 * Next.js의 Web Vitals 데이터를 Sentry로 전송하는 컴포넌트입니다.
 * Core Web Vitals (LCP, FID, CLS, FCP, TTFB, INP)를 캡처합니다.
 */
export function SentryWebVitals() {
  useReportWebVitals((metric) => {
    // Sentry에 메트릭 정보를 전송
    Sentry.addBreadcrumb({
      category: 'web-vitals',
      message: `${metric.name}: ${metric.value}`,
      level: 'info',
      data: {
        id: metric.id,
        label: metric.label,
      },
    });

    // 콘솔에서 확인하고 싶다면 추가 (배포 시엔 삭제 권장)
    console.log('Web Vital:', metric);
  });

  return null;
}
