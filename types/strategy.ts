export type SectorStance = 'positive' | 'neutral' | 'cautious';

export type SectorStrategy = {
  name: string;
  stance: SectorStance;
  label: string;
  reason: string;
  extra?: {
    type: 'etf' | 'strategy';
    value: string;
  };
};

export type MarketImpact = {
  market: 'KR' | 'US' | 'JP' | 'CN';
  stance: SectorStance;
  comment: string;
};

export type EtfStrategy = {
  symbol: string;
  region: 'US' | 'KR' | 'JP';
  comment: string;
};

export type DailyStrategy = {
  date: string;
  summary: string;

  sectors: SectorStrategy[];

  markets?: MarketImpact[];
  etfs?: EtfStrategy[];
};
