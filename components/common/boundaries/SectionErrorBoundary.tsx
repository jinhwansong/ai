'use client';

import React from 'react';
import * as Sentry from '@sentry/nextjs';
import ErrorState from '../ErrorState';

interface SectionErrorBoundaryProps {
  children: React.ReactNode;
  sectionName: string;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SectionErrorBoundary extends React.Component<
  SectionErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Sentry로 섹션별 에러 전송 (컨텍스트 포함)
    Sentry.captureException(error, {
      tags: {
        section: this.props.sectionName,
        errorBoundary: true,
      },
      extra: {
        componentStack: errorInfo.componentStack,
        sectionName: this.props.sectionName,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 있으면 사용, 없으면 기본 ErrorState
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="py-8">
          <ErrorState
            title={`${this.props.sectionName} 섹션 로딩 실패`}
            message="이 섹션을 불러오는 중 오류가 발생했습니다. 다른 섹션은 정상적으로 작동합니다."
            onReset={() => this.setState({ hasError: false, error: null })}
            showHome={false}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
