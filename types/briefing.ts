import { GlobalMacro } from './macro';

export interface TodayNews {
  title: string;
  descriptionShort: string;
  contentLong: string;
  tags: string[];
}

export interface TodaySignal {
  date: string;
  publishTime: string;
  title: string;
  summaryShort: string;
  summaryLong: string;
}

export interface DailyBriefing {
  signal: TodaySignal;
  news: TodayNews[];
  globalMacro: GlobalMacro;
}
