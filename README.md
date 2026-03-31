# 오늘의 시그널 · AI Market Briefing

> 글로벌 경제 뉴스를 모아 AI가 요약·분석한 시장 브리핑 웹앱 (Next.js / React)

[![Live Demo](https://img.shields.io/badge/live-ai--red--mu.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-red-mu.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)

## Overview

RSS·외부 소스로 수집한 뉴스를 바탕으로 **시그널, 글로벌 지수, 섹터 전략, 뉴스 피드, 관찰 포인트, 인사이트** 등을 한 화면에 모아 보여 줍니다.  
AI 분석·캐시·스케줄 작업은 API Route와 Redis/Supabase를 통해 동작합니다.

> 본 서비스는 투자 권유가 아닌 **정보 정리·참고용**입니다.

## Data & Sources

| 유형 | 내용 |
|------|------|
| **뉴스 수집** | 다중 **RSS** (Bloomberg·Reuters·FT·WSJ·CNBC·BBC·MarketWatch·NPR·Economist·Politico·AP 등 + Google News 기반 소스 검색) |
| **피드 메타** | 각 피드에 `finance` / `markets` / `business` / `world` / `politics` / `economy` 등 **category** 라벨 |
| **시장 지표** | **Yahoo Finance** — 코스피·나스닥·닛케이·유로 Stoxx 50 등 **지역별 대표 지수** 실시간에 가까운 시세 |
| **저장소** | 수집 원문·가공 데이터는 **Supabase**, 대시보드·캐시는 **Redis** |

크론/내부 API로 주기적으로 수집·브리핑 파이프라인이 돌아가며, 프론트는 `/api/main/*` 등으로 캐시된 결과를 조회합니다.

## Categories & Thematic Sectors

뉴스는 **16개 테마 섹터**로 나뉘어 검색·필터링됩니다. 각 섹터는 영문 키워드(연산자 `OR`)로 정의되어 있어, 예를 들어 *AI/반도체*는 `Nvidia`, `TSMC`, `HBM` 등이 한 축으로 묶입니다.

| ID | 한글 이름 |
|----|-----------|
| `macro` | 거시경제 |
| `ai_semis` | AI/반도체 |
| `bigtech` | 빅테크 |
| `energy_infra` | 에너지/전력 |
| `robotics` | 로보틱스 |
| `bio_health` | 바이오/헬스 |
| `finance_crypto` | 금융/가상자산 |
| `geopolitics` | 지정학/무역 |
| `space_defense` | 우주/방산 |
| `software_cyber` | SW/보안 |
| `real_estate` | 부동산 |
| `luxury_consumer` | 소비재/사치품 |
| `politics_policy` | 정치/입법 |
| `regulatory` | 규제/반독점 |
| `commodities` | 원자재/상품 |
| `climate_esg` | 기후/ESG |

**분석 키워드**는 위 섹터 **이름**을 베이스로 두고(`constants/sectors.ts` ↔ `analysis.ts`), 여기에 금리·인플레·지정학·데이터센터 등 **세부 축**을 더해 브리핑 프롬프트에 넣습니다. → **수집 축과 AI 요약 축이 같은 언어로 맞춰져** 일관된 인사이트를 내기 쉽게 설계했습니다.

## Features

- **Dashboard** — 섹션별 Suspense·스켈레톤, 섹션 단위 에러 경계
- **데이터** — TanStack Query, Redis 캐시, Supabase 저장소
- **뉴스 목록** — 가상 스크롤(`react-virtuoso`)로 대량 리스트 대응
- **관측·품질** — Sentry, Vercel Analytics / Speed Insights, GitHub Actions(감사·크론 등)

## Disclaimer

AI 생성 텍스트는 참고용이며, 투자 판단의 근거로 사용할 수 없습니다.

## License

Private / All rights reserved — 팀·저작자 정책에 따릅니다.
