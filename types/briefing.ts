import { GlobalMacro } from './macro';

export type BriefingIssue = {
  title: string;
  description: string;
};

export type DailyBriefing = {
  id: string;
  date: string;
  publishTime: string;

  title: string;
  summary: string;

  keyIssues: BriefingIssue[];
  globalMacro: GlobalMacro;
};
