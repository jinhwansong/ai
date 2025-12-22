import { useQuery } from '@tanstack/react-query';
import { fetchBriefing } from '@/lib/api/briefing';
import { withQueryDefaults } from './withQueryDefaults';

export const useBriefing = (id: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: ['briefing', id],
      queryFn: () => fetchBriefing(id),
      enabled: !!id,
    })
  );
