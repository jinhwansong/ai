export interface DailyReport {
  date: string;
  issues: {
    title: string;
    summary: string;
    koreaImpact: string;
  }[];
}
