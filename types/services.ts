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
    impact: string;
    time: string;
}

export interface NewsResponse {
  news: NewsItem[];
}

export interface MacroItem {
    region: string;
    indexName: string;
    value: string;
    change: string;
    status: string;
}

export interface MacroResponse {
  macro: MacroItem[];
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

export interface PortfolioResponse {
  performance: PortfolioPerformanceItem[];
  holdings: PortfolioHoldingItem[];
  strategicSummary: string;
}
