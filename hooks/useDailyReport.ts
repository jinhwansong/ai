import { useQuery } from '@tanstack/react-query';
import { fetchDailyReport } from '@/lib/api/report';
import { withQueryDefaults } from './withQueryDefaults';

export const useDailyReport = (date: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: ['daily-report', date],
      queryFn: () => fetchDailyReport(date),
      enabled: !!date,
    })
  );
