import { Fetcher } from '@/util/fetcher';
import { DailyReport } from '@/types/report';

export const fetchDailyReport = (date: string) =>
  Fetcher<DailyReport>(`/api/report/${date}`);
