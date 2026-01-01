export type MainBriefing = {
  date: string;
  publishTime: string;
  title: string;
  summary: string;
  briefingId: string;
};

type SectorStance = 'positive' | 'neutral' | 'cautious' | 'negative';
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
}

export interface MainNewsResponse {
  news: MainNewsItem[];
  date: string;
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

export interface PortfolioResponse {
  portfolio: RecommendedPortfolio;
  lastUpdate: string;
  source: string;
}