'use client';

import { Suspense, ReactNode } from 'react';
import { SectionErrorBoundary } from './SectionErrorBoundary';

interface SectionWrapperProps {
  children: ReactNode;
  sectionName: string;
  fallback: ReactNode;
  errorFallback?: ReactNode;
}

export default function SectionWrapper({
  children,
  sectionName,
  fallback,
  errorFallback,
}: SectionWrapperProps) {
  return (
    <SectionErrorBoundary sectionName={sectionName} fallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </SectionErrorBoundary>
  );
}
