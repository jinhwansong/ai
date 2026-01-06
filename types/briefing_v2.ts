export interface BriefingSnapshot {
  id: string;
  createdAt: string;
  tldr: string; // 1. AI 한 줄 요약 (List only)
  hotTopics: HotTopic[]; // 2. 오늘의 핫 토픽 (List + Detail)
  sectorMap: SectorMap; // 3. 관련 섹터 맵 (List + Detail)
  marketImpact: MarketImpact[]; // 4. 뉴스 -> 시장 영향 구조 설명 (List + Detail)
  globalIndices: GlobalIndex[]; // 5. 글로벌 지수 요약 (List only)
  futureScenarios: FutureScenario[]; // 6. 미래 시나리오 (List + Detail)
  glossary: GlossaryTerm[]; // 7. 경제 용어 돋보기 (Tooltip only)
}

// 2. 오늘의 핫 토픽
export interface HotTopic {
  summary: {
    id: string;
    title: string;
    tag: string;
    impactScore: number; // 1-10
  };
  detail: {
    description: string;
    relatedNews: RelatedNews[];
    aiAnalysis: string;
    caveat: string;
  };
}

// 3. 관련 섹터 맵 (Heatmap)
export interface SectorMap {
  summary: {
    sectors: {
      name: string;
      performance: number; // percentage
      trend: 'up' | 'down' | 'neutral';
    }[];
  };
  detail: {
    analysis: string;
    topPerformers: string[];
    bottomPerformers: string[];
  };
}

// 4. 뉴스 -> 시장 영향 구조 설명
export interface MarketImpact {
  summary: {
    id: string;
    newsTitle: string;
    affectedMarket: string;
    direction: 'positive' | 'negative' | 'neutral';
  };
  detail: {
    logicChain: string[]; // How A leads to B leads to C
    evidence: string;
    aiOpinion: string;
  };
}

// 5. 글로벌 지수 요약
export interface GlobalIndex {
  name: string;
  value: string;
  change: string;
  changePercent: string;
}

// 6. 미래 시나리오 (AI Analysis)
export interface FutureScenario {
  summary: {
    id: string;
    title: string;
    probability: 'high' | 'medium' | 'low';
  };
  detail: {
    fullScenario: string;
    preconditions: string[];
    riskFactors: string[];
    aiDisclaimer: string;
  };
}

// 7. 경제 용어 돋보기
export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface RelatedNews {
  title: string;
  url: string;
  source: string;
}

