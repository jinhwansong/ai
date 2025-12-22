export type MarketStance = 'positive' | 'neutral' | 'cautious' | 'negative';

export type GlobalMacro = {
  us: MarketStance;
  china: MarketStance;
  eu: MarketStance;
  japan: MarketStance;
};

export interface MainMacroResponse {
  date: string;
  publishTime: string;
  globalMacro: GlobalMacro;
}
