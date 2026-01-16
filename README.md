# 📡 오늘의 시그널 (Today's Signal)

> **AI가 분석하는 실시간 글로벌 경제 뉴스 기반 시장 브리핑 리포트**
> 
> 단순히 뉴스를 전달하는 것을 넘어, AI 요약 기술을 활용해 주식/ETF와 연계된 인사이트를 제공하는 모바일 퍼스트 뉴스 분석 서비스입니다.

[![Deployment](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-red-mu.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)](https://sentry.io/)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-90+-4285F4?style=for-the-badge&logo=lighthouse&logoColor=white)](#-성능-최적화-및-품질-관리)

---

## 🎯 프로젝트 개요 (Overview)

"출근길 10분, 쏟아지는 경제 뉴스 속에서 길을 잃는 직장인들을 위하여"

많은 직장인이 재테크에 관심을 두지만, 매일 아침 쏟아지는 방대한 양의 경제 뉴스를 모두 읽고 해석하기란 쉽지 않습니다. 특히 전문 용어가 가득한 기사는 초보 투자자들에게 높은 장벽이 됩니다.

저 또한 **"뉴스를 봐도 어떤 종목과 연결되는지, 지금 시장의 온도는 어떤지 한눈에 파악하기 어렵다"**는 갈증이 있었고, 이를 해결하고자 본 프로젝트를 시작했습니다.

'오늘의 시그널'은 Yahoo Finance2 API와 TheNewsAPI를 통해 수집한 공신력 있는 데이터를 기반으로, AI가 복잡한 맥락을 걷어내고 핵심 키워드와 투자 시그널만 골라 담아 직장인의 소중한 아침 시간을 아껴주는 '경제 나침반'이 되고자 합니다.

---

## 🚀 주요 가치 (Value Proposition)

시간 절약 (Time Efficiency): AI가 수백 건의 뉴스를 분석하여 당일 가장 중요한 12가지 키워드로 압축합니다.

직관적 연결 (Smart Connection): 뉴스 속에 숨은 종목(Stock/ETF)을 자동으로 매핑하여, 정보가 실질적인 투자 인사이트로 이어지게 합니다.

쉬운 언어 (User-Friendly): 어려운 경제 용어를 AI가 쉽게 풀이하고, 시장의 분위기를 시각화(Sentiment Gauge)하여 제공합니다.

---
## 🛠 Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/framer%20motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![next--themes](https://img.shields.io/badge/next--themes-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide-111827?style=for-the-badge&logo=lucide&logoColor=white)

### Backend & Infrastructure
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![The%20News%20API](https://img.shields.io/badge/The%20News%20API-111827?style=for-the-badge&logo=rss&logoColor=white)
![Yahoo Finance](https://img.shields.io/badge/Yahoo%20Finance-6001D2?style=for-the-badge&logo=yahoo&logoColor=white)

---

## 🧠 AI & 데이터 파이프라인 (How it works)

“오늘의 시그널”의 핵심은 **뉴스/지표 수집 → AI 병렬 분석 → 캐싱/저장 → 프론트 렌더링** 흐름을 안정적으로 운영하는 것입니다.  
프론트엔드는 이 파이프라인 위에서 **빠르게 읽히는 UI**와 **실시간 품질(성능/에러)**을 책임집니다.

### 1) 데이터 수집 (Sources)
- **뉴스 수집**: **The News API** 기반 (`lib/news/theNewsApi.ts`)
  - 12개 섹터를 순차 호출(2초 딜레이) → `raw_news` 테이블에 **uuid 기준 upsert(중복 방지)** (`app/api/internal/collect-news/route.ts`)
  - **스케줄(KST)**: 08:30 / 14:00 / 18:00
  - **쿼터/레이트리밋 대응**: `for...of` + `await setTimeout(2000)`로 섹터별 순차 호출(1회 실행 총 36개 요청)
- **시장 지표 수집**: `yahoo-finance2`로 주요 글로벌 지수 quote 수집 (`lib/api/yahooFinance.ts`)

### 2) AI 분석 (Gemini/OpenAI Dual Adapter)
- **모델 어댑터**:
  - Gemini: `lib/ai/gemini.ts` (`gemini-2.5-flash`)
  - OpenAI: `lib/ai/openai.ts` (`gpt-4.1-mini`, JSON-only response_format)
- **프롬프트 빌더**: 뉴스/섹터/영향도/관찰대상/인사이트를 각각 분리해 JSON 스키마를 강제 (`lib/prompts/*.ts`)
- **병렬 분석**: `performAIAnalysis`에서 5개 영역을 `Promise.all`로 병렬 호출하여 latency 최소화 (`lib/services/briefing.ts`)
- **영역별 모델 분리 지원**: `performAIAnalysis`는 `modelPlan`으로 영역별 모델 선택이 가능합니다. (예: `news/sector=gemini`, `impact/observation/insight=gpt`)

### 3) 저장/캐싱 전략 (Supabase + Redis)
- **Supabase**: 가공된 결과를 `news_articles`, `observation_items`, `sector_strategies`, `briefing_history` 등에 저장 (`app/api/internal/generate-briefing/route.ts`)
- **Redis**: 메인 대시보드용 결과를 시간 슬롯 키로 캐싱하고 최신 fallback 키도 유지 (`dashboard:latest`, `getTimeSlotRedisKey`)  
  → 메인 페이지는 Redis 캐시를 빠르게 읽어 **초기 로딩을 최소화**합니다. (`app/api/main/*`)

---

## ⏱ 크론 파이프라인 (Cron Pipeline)

### 실행 흐름
GitHub Actions가 `CRON_ENDPOINT`로 요청을 보내고, 서버는 내부 파이프라인을 순서대로 수행합니다.

- **Trigger**: `POST /api/internal/run-pipeline` (auth required)
- **Step 1**: `GET /api/internal/collect-news` (auth required)
- **Step 2**: `GET /api/internal/generate-strategy` (auth required)
- **Step 3**: `GET /api/internal/generate-briefing` (auth required)

모든 내부 라우트는 `Authorization: Bearer ${CRON_SECRET}` 가 필요합니다. (`util/verifyCronAuth.ts`)

### GitHub Actions 스케줄
- **KST 08:30 / 14:00 / 18:00**
- 설정 파일: `.github/workflows/cron.yml`

### 최근 업데이트 (운영 반영)
- **브리핑 생성 영역 분리**: `generate-briefing`은 기본 Gemini + `OPENAI_API_KEY`가 있을 때 영역별로 OpenAI를 혼합 사용합니다.  
  - Gemini: `news`, `sector` / OpenAI: `impact`, `observation`, `insight`
- **전략 생성 모델 선택**: `generate-strategy`는 환경변수로 모델 선택이 가능합니다.  
  - `AI_STRATEGY_MODEL=gemini|gpt` (default: gemini)  
  - `AI_STRATEGY_FALLBACK_MODEL=gemini|gpt` (default: opposite)
- **크론 시간대 정합성**: `detectTimeSlotFromCron`을 크론 스케줄(08:30/14:00/18:00 KST)과 일치하도록 수정하여 Redis 키(`dashboard:morning|afternoon|evening`)가 어긋나지 않게 했습니다. (`util/timeSlot.ts`)


## ✨ 핵심 기능 및 페이지 (Core Features)

### 📊 메인 리포트 대시보드
- **시각적 의사결정 지원**: AI가 분석한 당일 핵심 이슈를 대시보드 형태로 구성하여 시장의 흐름을 한눈에 파악할 수 있도록 설계했습니다.
- **AI 시장 온도계**: 뉴스 본문을 분석하여 시장 심리를 수치화하고 애니메이션 스코어로 시각화합니다.

### 📰 뉴스 상세 및 시각적 리포트
- **데이터 기반 레이아웃**: 단순 텍스트 나열이 아닌, 주요 지수와 뉴스의 맥락을 연결한 리포트 형식의 레이아웃을 제공합니다.
- **AI 3줄 요약**: 바쁜 현대인을 위해 핵심 체크포인트만 빠르게 전달합니다.

### 🔍 통합 검색 및 스마트 매핑
- **통합 검색 시스템**: 주식, ETF, 뉴스를 아우르는 통합 검색 결과를 제공하며 검색 기록 관리 기능을 지원합니다.
- **Smart Mapping**: 뉴스 내 언급된 종목 정보를 감지하여 상세 분석 모달로 즉시 연결합니다.

### 📲 PWA 및 모바일 최적화
- **오프라인 지원**: 네트워크 연결 없이도 캐시된 콘텐츠를 통해 기본 기능 사용 가능
- **앱 설치**: 데스크톱 및 모바일에서 네이티브 앱처럼 설치하여 홈 화면에서 바로 접근 가능
- **푸시 알림**: 중요한 시장 업데이트를 실시간으로 알림으로 받아 놓치지 않도록 지원
- **모바일 퍼스트 디자인**: 터치 친화적인 UI와 Pull-to-Refresh 등 모바일 네이티브 앱과 유사한 사용자 경험 제공
---

## 💎 고급 UI/UX 기능 (Advanced UI/UX)

- **무한 스크롤 (Infinite Scroll)**: `react-virtuoso`의 `endReached`로 다음 페이지를 트리거하고, 데이터는 TanStack Query `useInfiniteQuery`로 페이지네이션 로드합니다. (`components/common/VirtualizedList.tsx`, `hooks/useMain.ts`, `app/news/page.tsx`)
- **정교한 Skeleton UI**: 데이터 로딩 중 레이아웃 시프트(CLS)를 방지하고, 사용자 이탈을 막기 위해 실제 콘텐츠 구조와 일치하는 스켈레톤 화면을 설계했습니다.
- **Pull-to-Refresh**: 모바일 전용 커스텀 PTR 컴포넌트를 구현하여 네이티브 앱과 같은 사용성을 제공합니다.
- **Mobile Modal UX**: 종목/ETF 상세 팝업을 모바일에서 풀스크린으로 제공하고, 스크롤 잠금 및 safe-area를 고려해 겹침 없이 표시합니다. (`components/common/Modal.tsx`)

---

## 📱 PWA & 오프라인 기능 (Progressive Web App)

### 오프라인 대응 및 캐싱 전략
- **다중 캐싱 전략**: 요청 유형에 따라 최적의 캐싱 전략을 적용합니다.
  - **Network-First**: HTML 페이지 및 실시간 데이터 (네트워크 실패 시 캐시 사용)
  - **Cache-First**: 정적 자산 (JS, CSS, 폰트) - 빠른 로딩 보장
  - **Stale-While-Revalidate**: API 데이터 (`/api/main/*`) - 캐시된 데이터를 즉시 반환하고 백그라운드에서 업데이트
  - **이미지 캐싱**: 이미지는 별도 캐시로 관리하며 최대 50개로 제한하여 저장 공간 효율화
- **오프라인 페이지**: 네트워크 연결이 없을 때 사용자 친화적인 오프라인 페이지 제공 (`public/offline.html`)
- **캐시 버전 관리**: Service Worker 버전 업데이트 시 자동으로 오래된 캐시 정리

### PWA 설치 기능
- **커스텀 설치 프롬프트**: `usePWAInstall` hook을 통해 설치 가능 여부를 감지하고 사용자에게 설치를 유도합니다.
- **설치 상태 관리**: Standalone 모드 감지 및 설치 완료 이벤트 처리로 설치 상태를 실시간으로 추적합니다.
- **Manifest 최적화**: 앱 단축키(shortcuts), 카테고리, 아이콘 등 PWA 표준을 준수하여 다양한 플랫폼에서 최적의 설치 경험 제공

### 웹 푸시 알림
- **VAPID 기반 푸시 알림**: Web Push API를 활용한 서버-클라이언트 푸시 알림 시스템
- **구독 관리**: `usePushNotification` hook으로 간편한 알림 구독/해제 기능 제공
- **자동 구독 정리**: 만료되거나 유효하지 않은 구독을 자동으로 데이터베이스에서 제거하여 관리 효율성 향상
- **실시간 알림**: 시장 브리핑 업데이트 시 모든 구독자에게 자동으로 알림 전송 (`/api/internal/send-push-notifications`)

---

## 🏗 성능 최적화 및 품질 관리 (Engineering Excellence)

### ⚡ 성능 최적화 (UX)
- **Lighthouse All 90+**: 성능, 접근성, 권장사항, SEO 전 항목 90점 이상을 유지하고 있습니다.
- **최적화 기법**: `next/image`를 이용한 이미지 최적화 및 `next/font`를 통한 웹 폰트 로딩 최적화를 적용했습니다.
- **Real-user Monitoring**: Next.js Web Vitals 데이터를 Sentry로 전송하는 커스텀 훅을 구현하여 실제 사용자의 성능 지표를 실시간 모니터링합니다.

### 🛠 품질 자동화 (DX)
- **Commit 규칙 강제**: `@commitlint`와 `Husky`를 도입하여 **Conventional Commits**를 준수하도록 강제하여 팀 협업 효율을 높였습니다.
- **검증 자동화**: 빌드 전 Lint 체크 및 Type 체크를 통해 코드 품질을 자동 관리합니다.
- **CI/CD 파이프라인**: Vercel 자동 배포와 연동하여 배포 시 Sentry 소스맵 업로드를 자동화함으로써 에러 추적 효율을 극대화했습니다.

### 🔁 프론트엔드 데이터 페칭/캐싱 전략 (TanStack Query)
- **Query Key 설계**: 메인/뉴스상세/검색 등 도메인 단위로 queryKey를 분리 (`hooks/useMain.ts`)
- **기본 옵션 표준화**: `staleTime`, `retry`, `refetchOnWindowFocus`를 공통화해 UX 일관성 확보 (`hooks/withQueryDefaults.ts`)
- **Infinite Query**: 뉴스 리스트는 `useInfiniteQuery` + pagination 기반으로 끊김 없이 로드 (`useInfiniteNewsList`)
- **모바일 새로고침 UX**: Pull-to-Refresh가 `invalidateQueries()`로 최신 데이터 동기화 (`components/common/PullToRefresh.tsx`)

### 🧯 안정성/관측 가능성 (Sentry)
- **API 실패 자동 보고**: 공통 `Fetcher`에서 HTTP 실패/네트워크 오류를 Sentry로 전송하며 URL/Status/context를 함께 남김 (`util/fetcher.ts`, `lib/sentry.ts`)
- **소스맵 업로드 & Ad-block 우회**: `withSentryConfig` + `tunnelRoute`로 운영 환경에서 트레이싱 품질/가시성 강화 (`next.config.ts`)

---

## 📂 프로젝트 구조 (Folder Structure)

```bash
e:\code\ai
├── app/                  # Next.js App Router (Page, Layout, API Routes)
│   ├── analysis/         # AI 심층 분석 클라이언트 페이지
│   ├── api/              # AI 연동 및 데이터 처리 API
│   ├── news/             # 뉴스 상세 및 무한 스크롤 리스트
│   └── search/           # 통합 검색 페이지
├── components/           # 재사용 가능한 UI 컴포넌트
│   ├── common/           # Header, Modal, PTR, Skeleton 등 공통 요소
│   ├── main/             # 섹션별 핵심 비즈니스 컴포넌트
│   └── skeleton/         # 레이아웃 시프트 방지용 스켈레톤
├── hooks/                # Custom Hooks (Animation, Web Vitals, Data Fetching)
├── lib/                  # 외부 서비스 설정 (AI, Supabase, Redis, Sentry)
├── store/                # Zustand 전역 상태 관리 (Search, Toast)
├── style/                # 테마 변수 기반 글로벌 CSS (Dark Mode 지원)
├── types/                # TypeScript Interface/Type 정의
└── util/                 # 공통 유틸리티 (Time, Fetcher, Auth)
```

---

## 💡 기술적 도전 및 해결 (Technical Challenges)

### 1️⃣ 하이드레이션(Hydration) 불일치 해결
다크 모드 및 클라이언트 전용 데이터(`localStorage`) 사용 시 발생하는 하이드레이션 오류를 해결하기 위해 **Zustand의 `persist` 미들웨어**를 활용했습니다. Zustand는 자동으로 하이드레이션을 처리하여 서버와 클라이언트 간의 상태 불일치를 방지합니다. 

- **상태 관리 통일**: 검색 기록(`useSearchStore`), 알림 설정(`useShowNotice`) 등 클라이언트 전용 상태를 Zustand로 일원화
- **자동 하이드레이션**: `persist` 미들웨어가 localStorage와 동기화하여 서버 렌더링 시 초기값을 제공하고, 클라이언트 마운트 후 실제 저장된 값으로 자동 업데이트
- **타입 안정성**: TypeScript와 완벽하게 통합되어 타입 안전한 상태 관리 제공

### 2️⃣ Web Vitals & Sentry 커스텀 통합
LCP, FID, CLS 등 핵심 지표를 Sentry의 `captureMeasurement` API와 연결하여 단순 에러 로깅을 넘어 성능 지표 기반의 모니터링 환경을 구축했습니다.

### 3️⃣ Cursor 기반 AI 협업 개발
Cursor를 활용해 코드베이스를 빠르게 탐색/이해하고, 반복적인 리팩토링(타입 정리/구조 개선/문서화)을 진행했습니다. “AI에게 맡기기”보다는 **내가 설계 결정을 내리고, AI는 속도를 올리는 보조 도구**로 사용했습니다.

### 4️⃣ NewsAPI → The News API 마이그레이션 (운영 안정성)
- 기존 NewsAPI 의존을 제거하고, **The News API 기반으로 12개 섹터 최신 뉴스(섹터당 3개, 총 36개)**를 하루 3회 수집하도록 개편했습니다.
- **uuid(원천 ID) 기반 upsert**로 중복 수집을 방지하고, 섹터 키워드 매핑을 `contact/keyword.ts`로 단일화하여 수집-분석-필터의 일관성을 유지했습니다.

### 5️⃣ 모바일 UX 이슈: PTR/Sticky/Modal 충돌 해결
- PTR의 터치 이벤트가 스크롤을 막는 문제를 해결하기 위해 **모바일 + 최상단 + 아래로 당김** 조건에서만 `preventDefault`가 동작하도록 정리했습니다. (`components/common/PullToRefresh.tsx`)
- `position: sticky`가 transform/stacking context에 의해 깨지는 케이스를 피하기 위해, 필요한 UI는 fixed/portal 기반으로 안정화했습니다. (예: `Modal` portal)

### 6️⃣ PWA 오프라인 대응 및 Service Worker 최적화
- **다중 캐싱 전략 구현**: 요청 유형별로 최적의 캐싱 전략을 선택하여 오프라인 환경에서도 핵심 기능 사용 가능 (`public/sw.js`)
  - API 요청은 Stale-While-Revalidate로 최신성과 성능의 균형 유지
  - 정적 자산은 Cache-First로 즉시 로딩 보장
  - 네트워크 실패 시 자동으로 캐시된 데이터로 폴백
- **오프라인 UX**: 네트워크 연결이 없을 때도 기본 기능 사용 가능하며, 오프라인 상태를 명확히 안내하는 페이지 제공
- **캐시 크기 관리**: 이미지 캐시를 LRU 방식으로 관리하여 저장 공간 효율성 확보

### 7️⃣ PWA 설치 및 푸시 알림 구현
- **설치 프롬프트 제어**: `beforeinstallprompt` 이벤트를 활용하여 사용자 경험을 최적화한 커스텀 설치 UI 제공 (`hooks/usePWAInstall.ts`)
- **웹 푸시 알림 시스템**: VAPID 키 기반의 안전한 푸시 알림 구현으로 실시간 시장 업데이트를 사용자에게 전달
- **크로스 플랫폼 호환성**: iOS Safari의 `navigator.standalone` 및 표준 `display-mode: standalone` 모두 지원하여 다양한 플랫폼에서 일관된 PWA 경험 제공

---

## 🔗 링크 (Links)

- **Live Demo**: [https://ai-red-mu.vercel.app/](https://ai-red-mu.vercel.app/)
