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
