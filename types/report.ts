import { DailyBriefing } from './ai';
import { DailyStrategy } from './strategy';
import { NewsArticle } from './news';

export type DailyReport = {
  date: string; 
  keyword?: string;
  englishKeyword?: string;

  briefing: DailyBriefing;
  strategy?: DailyStrategy;

  articles: NewsArticle[];
  createdAt: string;
};
