export interface SectorResponse {
  sectors: {
    name: string;
    signal: string;
    focus: string;
    momentum: string;
    descriptionLong: string;
  }[];
}

export interface NewsResponse {
  news: {
    title: string;
    descriptionShort: string;
    contentLong: string;
    tags: string[];
    impact: string;
    time: string;
  }[];
}

export interface MacroResponse {
  macro: {
    region: string;
    indexName: string;
    value: string;
    change: string;
    status: string;
  }[];
}

export interface PortfolioResponse {
  performance: {
    label: string;
    value: string;
    delta: string;
  }[];
  holdings: {
    name: string;
    ratio: string;
    change: string;
  }[];
}
