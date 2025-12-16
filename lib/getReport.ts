import { Fetcher } from "@/util/fetcher"
import { DailyReport } from '@/types/report';

export const getDailyReport = () => {
    return Fetcher<{data:DailyReport}>('/api/daily')
}

export const searchReport = (keyword: string) => {
  return Fetcher<{ data: DailyReport }>('/api/search', {
    method: 'POST',
    body: JSON.stringify({ keyword }),
  });
};