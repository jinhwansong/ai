export type MainBriefing = {
  date: string;
  publishTime: string;
  title: string;
  summary: string;
  briefingId: string;
};

export interface ImpactZone {
  label: string;
  status: '강세' | '약세' | '중립';
}

export interface MainSignal {
  focus: string;
  description: string;
  value: string;
  change: string;
  impactZones: ImpactZone[];
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
  aiAnalysis: string;
}

export interface ObservationItem {
  symbol: string;
  name: string;
  type: 'Stock' | 'ETF';
  reason: string;
  tags: string[];
  momentum: 'Strong' | 'Moderate' | 'Building';
}

export interface NewsItem {
  title: string;
  summary: string;
  tags: string[];
  published_at: string;
  source: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface NewsFeedProps {
  news: NewsItem[];
}
export interface InsightItem {
  summary: string;
  generatedAt: string;
}
