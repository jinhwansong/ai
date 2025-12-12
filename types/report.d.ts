export interface DailyIssue {
  title: string;
  summary: string;
  koreaImpact: string;
}

export interface DailyReport {
  date: string;
  issues: DailyIssue[];
}
