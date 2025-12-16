import { useQuery } from '@tanstack/react-query';
import { withQueryDefaults } from './withQueryDefaults';
import { getDailyReport, searchReport } from '@/lib/getReport';


export const useDailyReport = () => {
  return useQuery(
    withQueryDefaults({
      queryKey: ['daily-report'],
      queryFn: getDailyReport,
    })
  );
};

export const useSearchNews = (keyword: string) => {
  return useQuery(
    withQueryDefaults({
      queryKey: ['search-news', keyword],
      queryFn: () => searchReport(keyword),
      enabled: !!keyword,
    })
  );
};
