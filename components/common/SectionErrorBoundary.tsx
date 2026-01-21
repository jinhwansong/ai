'use client';

import React, { Component, type ReactNode } from 'react';
import ErrorState from './ErrorState';
import { reportError } from '@/lib/core/sentry';

interface Props {
  children: ReactNode;
  sectionName: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 섹션별 에러 바운더리
 * 
 * 사용 예시:
 * <SectionErrorBoundary sectionName="시그널 하이라이트">
 *   <SignalHighlight />
 * </SectionErrorBoundary>
 * 
 * 장점:
 * - 한 섹션의 에러가 전체 페이지를 망가뜨리지 않음
 * - 사용자는 다른 섹션의 데이터를 계속 볼 수 있음
 * - 각 섹션별로 독립적인 에러 처리 가능
 */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Sentry에 섹션별 에러 보고
    reportError(error, {
      section: this.props.sectionName,
      componentStack: errorInfo.componentStack,
    });
    console.error(`[${this.props.sectionName}] Section Error:`, error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 있으면 사용, 없으면 기본 ErrorState
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="kakao-card p-6">
          <ErrorState
            title={`${this.props.sectionName} 로딩 실패`}
            message="이 섹션의 데이터를 불러오는 중 오류가 발생했습니다."
            onReset={this.handleReset}
            showHome={false}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
