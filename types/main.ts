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

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  published_at: string;
  source: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface MainNewsResponse {
  news: NewsItem[];
  date: string;
}

export interface NewsArticle extends NewsItem {
  url: string;
  content: string;
  checkpoints: string[];
  related_sectors: string[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

export interface NewsListResponse {
  data: NewsItem[];
  success: boolean;
  pagination: Pagination;
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
  relatedNews?: {
    title: string;
    source: string;
    url: string;
    time: string;
  }[];
}



export interface InsightItem {
  summary: string;
  generatedAt: string;
}
