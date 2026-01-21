# 섹션별 에러 바운더리 예시

## 현재 문제 상황

### Before ❌ (현재 상태)

```typescript
// app/page.tsx
export default function Home() {
  return (
    <main>
      <SignalHighlight />      {/* API 에러 발생 시 */}
      <GlobalMacro />          {/* 전체 페이지가 에러 페이지로 전환 */}
      <NewsFeed />             {/* 사용자는 아무것도 볼 수 없음 */}
      <SectorStrategy />
    </main>
  );
}
```

**문제점:**
- `SignalHighlight`에서 API 에러 발생 → 전체 페이지가 `app/error.tsx`로 전환
- 사용자는 다른 섹션의 데이터도 볼 수 없음
- 한 섹션의 실패가 전체 서비스 사용을 막음

---

## 해결 방법: 섹션별 에러 바운더리

### After ✅ (개선 후)

```typescript
// app/page.tsx
import { SectionErrorBoundary } from '@/components/common/SectionErrorBoundary';

export default function Home() {
  return (
    <main>
      <SectionErrorBoundary sectionName="시그널 하이라이트">
        <SignalHighlight />      {/* 에러 발생 시 이 섹션만 에러 표시 */}
      </SectionErrorBoundary>
      
      <SectionErrorBoundary sectionName="글로벌 시장">
        <GlobalMacro />          {/* 정상 작동 */}
      </SectionErrorBoundary>
      
      <SectionErrorBoundary sectionName="뉴스 피드">
        <NewsFeed />             {/* 정상 작동 */}
      </SectionErrorBoundary>
      
      <SectionErrorBoundary sectionName="섹터 전략">
        <SectorStrategy />       {/* 정상 작동 */}
      </SectionErrorBoundary>
    </main>
  );
}
```

**개선 효과:**
- ✅ **부분 실패 허용**: 한 섹션 실패해도 나머지 섹션은 정상 작동
- ✅ **사용자 경험 향상**: 사용자는 사용 가능한 데이터를 계속 볼 수 있음
- ✅ **에러 격리**: 각 섹션의 에러가 다른 섹션에 영향 없음

---

## 실제 사용 예시

### 시나리오 1: SignalHighlight API 실패

**Before:**
```
[전체 페이지 에러 화면]
"서비스 이용에 불편을 드려 죄송합니다"
[다시 시도] [홈으로]
```

**After:**
```
[시그널 하이라이트 섹션]
"시그널 하이라이트 로딩 실패"
"이 섹션의 데이터를 불러오는 중 오류가 발생했습니다."
[다시 시도]

[글로벌 시장 섹션] ✅ 정상 표시
[뉴스 피드 섹션] ✅ 정상 표시
[섹터 전략 섹션] ✅ 정상 표시
```

### 시나리오 2: NewsFeed와 SectorStrategy 동시 실패

**Before:**
```
[전체 페이지 에러 화면]
```

**After:**
```
[시그널 하이라이트] ✅ 정상
[글로벌 시장] ✅ 정상
[뉴스 피드] ❌ 에러 메시지
[섹터 전략] ❌ 에러 메시지
[관찰 포인트] ✅ 정상
```

---

## 구현 코드

### SectionErrorBoundary 컴포넌트

```typescript
// components/common/SectionErrorBoundary.tsx
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
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
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
```

### 사용 예시

```typescript
// app/page.tsx
import { SectionErrorBoundary } from '@/components/common/SectionErrorBoundary';

export default function Home() {
  return (
    <main>
      <SectionErrorBoundary sectionName="시그널 하이라이트">
        <SignalHighlight />
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="글로벌 시장">
        <GlobalMacro />
      </SectionErrorBoundary>

      <SectionErrorBoundary sectionName="뉴스 피드">
        <NewsFeed />
      </SectionErrorBoundary>
    </main>
  );
}
```

---

## 장점 요약

| 항목 | Before | After |
|------|--------|-------|
| **에러 영향 범위** | 전체 페이지 | 해당 섹션만 |
| **사용자 경험** | 모든 데이터 못 봄 | 일부 데이터라도 볼 수 있음 |
| **에러 추적** | 전체 페이지 에러 | 섹션별 에러 추적 가능 |
| **복구 가능성** | 전체 페이지 새로고침 | 해당 섹션만 재시도 |

---

## 추가 개선 사항

### 1. 커스텀 Fallback UI

```typescript
<SectionErrorBoundary
  sectionName="시그널 하이라이트"
  fallback={
    <div className="kakao-card p-6 text-center">
      <p className="text-sm text-(--text-muted)">
        시그널 데이터를 불러올 수 없습니다.
      </p>
    </div>
  }
>
  <SignalHighlight />
</SectionErrorBoundary>
```

### 2. React Query와 통합

```typescript
// hooks/useMain.ts에서 에러 처리
export const useMainSignal = () => {
  return useQuery(
    withQueryDefaults({
      queryKey: ['main-signal'],
      queryFn: fetchMainSignal,
      // 에러 발생 시 ErrorBoundary로 전달
      throwOnError: true,
    })
  );
};
```

### 3. 에러 타입별 처리

```typescript
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // 네트워크 에러 vs 데이터 파싱 에러 구분
  const errorType = error.message.includes('fetch') 
    ? 'network' 
    : 'parsing';
    
  reportError(error, {
    section: this.props.sectionName,
    errorType,
    componentStack: errorInfo.componentStack,
  });
}
```
