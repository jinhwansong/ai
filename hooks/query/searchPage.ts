import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { api } from '@/lib/services';
import { withQueryDefaults } from '../withQueryDefaults';
import { mainQueryKeys } from './queryKeys';

export const useSearch = (query: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: mainQueryKeys.search(query),
      queryFn: () => api.main.search(query),
      enabled: !!query,
    })
  );

export const useSuspenseSearch = (query: string) =>
  useSuspenseQuery({
    queryKey: mainQueryKeys.search(query),
    queryFn: () => api.main.search(query),
  });
