import { useQuery } from '@tanstack/react-query';
import { fetchStrategy } from '@/lib/api/strategy';
import { withQueryDefaults } from './withQueryDefaults';

export const useStrategy = (id: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: ['strategy', id],
      queryFn: () => fetchStrategy(id),
      enabled: !!id,
    })
  );
