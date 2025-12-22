import { DailyBriefing } from './briefing';
import { DailyStrategy } from './strategy';

export type DailyReport = {
  date: string;
  generatedAt: string;
  briefing: DailyBriefing;
  strategy: DailyStrategy;
};

export interface TranslatedNews {
  url: string;
  titleKo: string;
  summaryKo: string;
}

export interface DailyIssue {
  title: string;
  description: string;
  relatedUrls: string[];
  tags: string[];
}
