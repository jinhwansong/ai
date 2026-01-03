export type MainBriefing = {
  date: string;
  publishTime: string;
  title: string;
  summary: string;
  briefingId: string;
};

export interface MainSignal {
  focus: string;
  description: string;
  value: string;
  change: string;
  tags: string[];
  updatedAt: string;
}

export type SectorStance = 'POSITIVE' | 'NEUTRAL' | 'WATCHING' | 'NEGATIVE';
type SectorType = 'sector' | 'etf';

export interface MainSectorStrategy {
  date: string;
  items: {
    type: SectorType;
    name: string;
    stance: SectorStance;
    label: string;
    reason: string;
    guide: string;
  }[];
}

export interface MainNewsItem {
  title: string;
  summary: string;
  tags: string[];
  published_at: string;
  source: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface MainNewsResponse {
  news: MainNewsItem[];
  date: string;
}

export type MarketStance = 'positive' | 'neutral' | 'cautious' | 'negative';

export interface GlobalMacroItem {
  region: string;
  indexName: string;
  value: string;
  change: string;
  status: MarketStance;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  currency: string;
}

export interface MarketIndicesResponse {
  indices: MarketIndex[];
  lastUpdate: string;
  source: string;
}

export interface EconomicIndicator {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  lastUpdate: string;
  status: 'positive' | 'negative' | 'neutral';
}

export interface EconomicIndicatorsResponse {
  indicators: EconomicIndicator[];
  lastUpdate: string;
  source: string;
}

export interface PortfolioAllocation {
  asset: string;
  name: string;
  percentage: number;
  currentValue: number;
  change: number;
}

export interface RecommendedPortfolio {
  id: string;
  name: string;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  expectedReturn: number;
  expectedVolatility: number;
  description: string;
  allocations: PortfolioAllocation[];
  keyInsights: string[];
  lastUpdate: string;
  aiConfidence: number;
}

export interface PortfolioPerformanceItem {
  label: string;
  value: string;
  delta: string;
}

export interface PortfolioHoldingItem {
  name: string;
  ratio: string;
  change: string;
}

export interface PortfolioData {
  performance: PortfolioPerformanceItem[];
  holdings: PortfolioHoldingItem[];
  strategicSummary?: string;
}

export interface PortfolioResponse {
  portfolio: RecommendedPortfolio;
  lastUpdate: string;
  source: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  tags: string[];
  published_at: string;
  source: string;
  impact: 'High' | 'Medium' | 'Low';
};

export interface NewsFeedProps {
  news: NewsItem[];
};