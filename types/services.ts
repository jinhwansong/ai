export interface SectorItem {
    name: string;
    signal: string;
    focus: string;
    momentum: string;
    descriptionLong: string;
}

export interface SectorResponse {
  sectors: SectorItem[];
}

export interface NewsItem {
    title: string;
    descriptionShort: string;
    contentLong: string;
    tags: string[];
    relatedSectors: string[];
    impact: string;
    time: string;
}

export interface NewsResponse {
  news: NewsItem[];
}

export interface ImpactZone {
  label: string;
  status: '강세' | '약세' | '중립';
}

export interface MarketImpactResponse {
  score: number;
  direction: string;
  zones: ImpactZone[];
  focus: string;
  description: string;
  tags: string[];
}

export interface InsightResponse {
  summary: string;
}

export interface ObservationItem {
  symbol: string;
  name: string;
  type: 'Stock' | 'ETF';
  reason: string;
  tags: string[];
  momentum: 'Strong' | 'Moderate' | 'Building';
}

export interface ObservationResponse {
  observations: ObservationItem[];
}

export interface MacroItem {
    region: string;
    indexName: string;
    value: string;
    change: string;
    status: string;
    aiAnalysis: string;
}

export interface MacroResponse {
  macro: MacroItem[];
}
