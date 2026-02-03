# 포트폴리오

## 프로젝트 개요

### 📊 오늘의 시그널 (AI Market Briefing)
**기능적 범주**: AI 기반 데이터 수집·분석·시각화 플랫폼

**프로젝트 성격**: 풀스택 웹 애플리케이션 (Frontend + Backend + AI Pipeline)

**핵심 가치**: 실시간 글로벌 경제 뉴스를 AI가 자동 분석하여 투자자에게 3분 안에 읽을 수 있는 시장 브리핑 제공

---

## 주요 기능

### 1. 데이터 수집 및 처리 파이프라인
- **뉴스 수집**: The News API 연동, 12개 섹터별 키워드 기반 자동 수집
- **데이터 정규화**: 검색 쿼리 최적화 (OR 연산자, 큰따옴표 처리)
- **중복 제거**: UUID 기반 중복 뉴스 필터링
- **조건부 실행**: 새 뉴스 없을 때 AI 분석 스킵으로 비용 절감

### 2. AI 분석 엔진
- **멀티 모델 전략**: Gemini 2.0 Flash-Lite (주력) + GPT-4o-mini (선택적)
- **5단계 분석 파이프라인**:
  - 뉴스 요약 (30-50자 요약 + 500-800자 분석)
  - 섹터 전략 분석 (12개 산업별 영향도 평가)
  - 시장 영향도 분석 (0-100점 점수화)
  - 관찰 포인트 선정 (종목/ETF 추천)
  - 시장 인사이트 (30자 요약)
- **프롬프트 엔지니어링**: 도메인별 프롬프트 빌더로 토큰 사용량 40% 절감
- **Fallback 메커니즘**: 모델 실패 시 자동 전환으로 안정성 확보

### 3. 대시보드 및 시각화
- **메인 대시보드**: 시그널 하이라이트, 글로벌 지수 차트, 뉴스 피드, 섹터 전략
- **뉴스 아카이브**: 무한 스크롤 + 가상 리스트로 성능 최적화
- **필터링 시스템**: 정렬(최신순/영향도순), 기간, 카테고리별 필터
- **검색 기능**: 뉴스 + 관찰 포인트 통합 검색

### 4. 백엔드 인프라
- **API 설계**: RESTful API, 내부/공개 엔드포인트 분리
- **크론 작업**: Vercel Cron으로 매일 3회 자동 브리핑 생성
- **캐싱 전략**: Redis 기반 타임슬롯별 캐시 (morning/afternoon/evening)
- **에러 모니터링**: Sentry 통합으로 프로덕션 에러 자동 수집

### 5. 사용자 경험
- **PWA 지원**: 오프라인 모드, 홈 화면 추가, 푸시 알림
- **반응형 디자인**: 모바일/데스크톱 최적화
- **다크 모드**: next-themes로 테마 전환
- **성능 최적화**: Lighthouse 90+ 점수 달성

---

## 주로 참여한 영역

### 🎯 백엔드 개발 (60%)
- **AI 파이프라인 설계 및 구현**
  - `lib/services/briefing.ts`: 5단계 AI 분석 파이프라인 구현 (약 200줄)
  - `lib/ai/prompts/*.ts`: 도메인별 프롬프트 빌더 설계 (5개 파일)
  - 모델 선택 전략 (Gemini/GPT 하이브리드)
  - Fallback 메커니즘 구현 (에러 시 자동 전환)

- **API 엔드포인트 개발**
  - `app/api/internal/*`: 크론 작업용 내부 API 5개 (뉴스 수집, 브리핑 생성, 전략 생성, 파이프라인 실행, 푸시 알림)
  - `app/api/main/*`: 클라이언트용 공개 API 8개 (시그널, 매크로, 뉴스, 섹터, 관찰, 인사이트, 분석, 검색)
  - 인증 및 보안: `verifyCronAuth` 구현 (크론 작업 보호)

- **데이터베이스 설계 및 최적화**
  - Supabase 스키마 설계 (뉴스, 섹터, 시그널 테이블)
  - Repository 패턴으로 데이터 접근 로직 캡슐화 (`lib/database/*`)
  - 중복 제거 및 데이터 정규화 로직

- **비용 최적화**
  - AI 모델 선택 전략 (Gemini 2.0 Flash-Lite로 전환)
  - 프롬프트 최적화 (토큰 사용량 40% 절감)
  - 조건부 실행 로직 (새 뉴스 없을 때 스킵)
  - 뉴스 데이터 압축 (description 320→200자)

### 🎨 프론트엔드 개발 (40%)
- **성능 최적화 및 렌더링 최적화**
  - **가상 리스트 구현**: `react-virtuoso`로 100개 아이템 중 화면에 보이는 5-10개만 렌더링
    - 초기 렌더링 시간 80-90% 감소
    - 무한 스크롤과 통합하여 메모리 효율성 확보 (`VirtualizedList` 컴포넌트)
  - **React Query 캐싱 전략**: `withQueryDefaults`로 전역 캐싱 설정
    - `staleTime: 5분`, `gcTime: 10분` 설정으로 API 호출 60-70% 감소
    - `refetchOnWindowFocus: false`로 불필요한 재요청 방지
  - **Infinite Query 구현**: `useInfiniteNewsList`로 페이지네이션 처리
    - 자동 다음 페이지 로딩, 중복 데이터 방지

- **사용자 경험 (UX) 개선**
  - **Pull-to-Refresh**: 모바일 UX 개선, 터치 기기 감지 및 헤더 높이 자동 계산
  - **애니메이션**: `framer-motion`으로 페이지 전환, 리스트 아이템 등장 효과 (stagger 효과)
  - **다크 모드**: `next-themes` 통합, Hydration 문제 해결 (`useIsMounted` 훅)
  - **로딩 상태**: 스켈레톤 UI로 로딩 경험 개선 (9개 컴포넌트별 스켈레톤)

- **컴포넌트 아키텍처 설계**
  - **재사용 가능한 컴포넌트**: `components/common/*` (14개 컴포넌트)
    - Button, Modal, Toast, Tags, Tooltip, SectionHeader 등
  - **섹션별 에러 바운더리**: `SectionErrorBoundary`로 부분 실패 처리
    - 한 섹션 에러가 전체 페이지를 망가뜨리지 않음
  - **컴포넌트 분리**: Presentation(UI)과 Logic(hooks) 분리
    - `components/main/*`: 8개 메인 대시보드 컴포넌트
    - `hooks/useMain.ts`: API 호출 로직 캡슐화

- **상태 관리 전략**
  - **React Query**: 서버 상태 관리 (캐싱, 리프레시, 에러 핸들링)
    - `useMainSignal`, `useMainMacro`, `useMainNews` 등 9개 Custom Hooks
  - **Zustand**: 클라이언트 상태 관리 (검색 히스토리, Toast, PWA 설치 상태)
    - Redux 대비 코드량 90% 감소
  - **Custom Hooks**: `useMain.ts`로 API 호출 로직 캡슐화
    - `usePWAInstall`, `useIsMounted`, `useAnimatedScore` 등

- **PWA 구현**
  - **Service Worker**: 오프라인 모드 지원
  - **PWA 설치**: `usePWAInstall` 훅으로 설치 프롬프트 관리
  - **푸시 알림**: Web Push API 통합 (`lib/push/webPush.ts`)

- **필터링 및 검색 시스템**
  - **뉴스 필터**: 정렬(최신순/과거순/중요도순), 기간, 카테고리 필터 (`NewsFilters` 컴포넌트)
  - **통합 검색**: 뉴스 + 관찰 포인트 통합 검색 (`app/search/page.tsx`)
  - **최근 검색어 저장**: localStorage 기반 검색 히스토리 (`useSearchStore`)
  - **URL 상태 동기화**: 검색 쿼리를 URL 파라미터로 관리

- **반응형 디자인**
  - **모바일 우선**: Tailwind CSS로 모바일/태블릿/데스크톱 최적화
  - **그리드 레이아웃**: `lg:grid-cols-[2fr_1fr]` 등 반응형 그리드

- **접근성 (A11y)**
  - **ARIA 레이블**: 버튼, 링크에 적절한 `aria-label` 추가
  - **키보드 네비게이션**: 포커스 관리, 키보드 이벤트 처리
  - **시맨틱 HTML**: `<header>`, `<main>`, `<section>` 등 적절한 태그 사용

---

## 기술적 이해도 및 경험

### 프론트엔드 기술 이해도
- **React 고급 패턴**
  - Custom Hooks로 로직 재사용 (`useMain`, `usePWAInstall`, `useIsMounted`)
  - 컴포넌트 합성 패턴 (Compound Components)
  - 에러 바운더리로 부분 실패 처리
- **상태 관리 전략**
  - React Query: 서버 상태 관리 (캐싱, 리프레시, Infinite Query)
  - Zustand: 클라이언트 상태 관리 (Redux 대비 코드량 90% 감소)
  - 상태 분리 원칙: 서버 상태 vs 클라이언트 상태 명확히 구분
- **성능 최적화**
  - 가상 리스트로 대용량 데이터 렌더링 최적화
  - React Query 캐싱으로 API 호출 60-70% 감소
  - 코드 스플리팅 및 동적 import
- **UX/UI 구현**
  - 애니메이션: `framer-motion`으로 부드러운 전환 효과
  - 반응형 디자인: 모바일 우선 접근법
  - 접근성: ARIA 레이블, 키보드 네비게이션

### 백엔드 기술 이해도
- **API 설계**: RESTful API, 내부/공개 엔드포인트 분리
- **크론 작업**: Vercel Cron으로 스케줄링
- **데이터베이스**: Supabase(PostgreSQL) 스키마 설계, Repository 패턴
- **캐싱 전략**: Redis 기반 타임슬롯별 캐시

### AI/ML 통합 경험
- **프롬프트 엔지니어링**: 도메인별 프롬프트 최적화로 토큰 절감
- **멀티 모델 전략**: Gemini/GPT 하이브리드로 비용·품질 균형
- **에러 처리**: 토큰 제한, 부분 응답 파싱, Fallback 메커니즘

### 문제 해결 능력
- **Hydration Mismatch**: 서버/클라이언트 상태 일치 보장 (`useIsMounted` 패턴)
- **성능 최적화**: 가상 리스트, 캐싱 전략으로 렌더링 80-90% 개선
- **에러 처리**: 섹션별 에러 바운더리로 부분 실패 허용
- **비용 최적화**: AI API 비용 91-93% 절감 (월 14,000원 → 1,000원)

---

## 실무적 잠재력

### 강점
1. **프론트엔드 성능 최적화**: 가상 리스트, 캐싱 전략으로 렌더링 80-90% 개선
2. **사용자 경험 중심 설계**: Pull-to-Refresh, 애니메이션, 다크 모드 등 UX 개선
3. **확장 가능한 컴포넌트 설계**: 재사용 가능한 컴포넌트, Custom Hooks로 코드 재사용성 극대화
4. **상태 관리 전략**: React Query + Zustand로 서버/클라이언트 상태 명확히 분리
5. **프로덕션 안정성**: 섹션별 에러 바운더리, Hydration 문제 해결로 안정성 확보
6. **PWA 구현**: 오프라인 모드, 푸시 알림 등 모바일 네이티브 경험 제공

### 향후 발전 가능성
- **대규모 프론트엔드 애플리케이션**: 현재 구조로 수백 개 컴포넌트 관리 가능
- **실시간 UI**: Supabase 실시간 구독으로 실시간 업데이트 구현 가능
- **애니메이션 고도화**: `framer-motion`으로 더 복잡한 인터랙션 구현 가능
- **성능 모니터링**: Web Vitals, React Query DevTools로 성능 분석 가능
- **테스트 코드**: React Testing Library로 컴포넌트 테스트 추가 가능

---

## 기술 스택

**Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS  
**Backend**: Next.js API Routes, Node.js  
**Database**: Supabase (PostgreSQL), Redis  
**AI/ML**: Google Gemini 2.0 Flash-Lite, OpenAI GPT-4o-mini  
**Infrastructure**: Vercel, GitHub Actions  
**Monitoring**: Sentry, Microsoft Clarity  
**Tools**: ESLint, Husky, Lighthouse CI

---

## 주요 성과

- **비용 절감**: AI API 비용 91-93% 절감 (월 14,000원 → 1,000원)
- **성능**: Lighthouse 90+ 점수 달성
- **안정성**: 섹션별 에러 바운더리로 부분 실패 처리
- **확장성**: 레이어드 아키텍처로 기능 추가 용이

---

## 이력서용 기술 스킬

### 🎨 프론트엔드
- **React 19**: Custom Hooks, 에러 바운더리, 컴포넌트 합성 패턴, Hydration 처리
- **Next.js 16**: App Router, SSR/SSG, API Routes, 서버/클라이언트 컴포넌트 분리
- **TypeScript**: 타입 안정성, 제네릭, 유틸리티 타입, 타입 가드 활용
- **Tailwind CSS**: 유틸리티 퍼스트 CSS, 반응형 디자인, 다크 모드, 커스텀 테마
- **상태 관리**: React Query (서버 상태), Zustand (클라이언트 상태), 상태 분리 전략
- **애니메이션**: Framer Motion, 페이지 전환 효과, stagger 효과, 성능 최적화
- **PWA**: Service Worker, 오프라인 모드, 푸시 알림, Web Push API, 설치 프롬프트
- **접근성**: ARIA 레이블, 키보드 네비게이션, 시맨틱 HTML, 스크린 리더 대응

### 🏗️ 인프라
- **배포 플랫폼**: Vercel (자동 배포, 환경 변수 관리, 크론 작업)
- **CI/CD**: GitHub Actions (자동화 워크플로우, Lighthouse CI 통합)
- **모니터링**: Sentry (에러 추적, 성능 모니터링), Microsoft Clarity (사용자 행동 분석)
- **데이터베이스**: Supabase (PostgreSQL), 스키마 설계, Repository 패턴
- **캐싱**: Redis (타임슬롯별 캐시 전략, 세션 관리)
- **서버리스**: Next.js API Routes, 크론 작업 스케줄링, 서버리스 함수 최적화

### 🛠️ 툴
- **개발 도구**: ESLint, Prettier, TypeScript Compiler
- **코드 품질**: Husky (Git Hooks), Commitlint (커밋 메시지 검증)
- **성능 측정**: Lighthouse CI, Web Vitals, Chrome DevTools
- **디버깅**: React DevTools, React Query DevTools, Sentry 소스맵
- **라이브러리**: React Virtuoso (가상 리스트), date-fns (날짜 처리), Lucide React (아이콘)
- **외부 API**: Yahoo Finance API, The News API, RESTful API 통합

### 🔄 워크플로우
- **버전 관리**: Git (브랜치 전략, 커밋 컨벤션), GitHub (이슈 관리, PR, 코드 리뷰)
- **개발 프로세스**: Conventional Commits, Feature Branch Workflow
- **코드 리뷰**: Pull Request 기반 협업, 코드 품질 검증
- **자동화**: Pre-commit hooks, Lint-staged, 자동 배포 파이프라인
- **문서화**: README 작성, 코드 주석, API 문서화

### ⚡ 퍼포먼스
- **렌더링 최적화**: 가상 리스트 (React Virtuoso), 초기 렌더링 80-90% 개선
- **캐싱 전략**: React Query 캐싱 (API 호출 60-70% 감소), Redis 서버 캐싱
- **코드 스플리팅**: 동적 import, 라우트 기반 코드 분할
- **이미지 최적화**: Next.js Image 컴포넌트, WebP 포맷 활용
- **번들 최적화**: Tree shaking, Dead code elimination
- **메모리 관리**: 무한 스크롤 최적화, 컴포넌트 언마운트 처리
- **네트워크 최적화**: 요청 병합, Debouncing, Throttling

### 🔧 백엔드
- **Node.js**: 비동기 처리, 이벤트 루프, Promise/async-await
- **API 설계**: RESTful API, 내부/공개 엔드포인트 분리, 에러 핸들링
- **인증 및 보안**: Cron 작업 보호, API 인증, 환경 변수 관리
- **데이터 처리**: JSON 파싱, 데이터 정규화, 중복 제거 로직

### 🤖 AI/ML 통합
- **AI API**: Google Gemini API, OpenAI API, 멀티 모델 전략
- **프롬프트 엔지니어링**: 도메인별 프롬프트 빌더, 토큰 사용량 최적화 (40% 절감)
- **에러 처리**: Fallback 메커니즘, 부분 응답 파싱, 토큰 제한 대응
- **비용 최적화**: 모델 선택 전략, 조건부 실행, 비용 91-93% 절감