export type MarketImpact = {
  kospi: string;
  kosdaq: string;
  comment: string;
};

export type JapanMarketImpact = {
  nikkei: string;
  topix: string;
  comment: string;
};

export type SectorStrategy = {
  name: string;
  score: number;
  strategy: string;
};

export type EtfStrategy = {
  name: string; 
  region: 'US' | 'KR' | 'JP';
  strategy: string;
};

export type DailyStrategy = {
  marketImpact: {
    korea: MarketImpact;
    japan: JapanMarketImpact;
  };
  sectors: SectorStrategy[];
  etfs: EtfStrategy[];
};
