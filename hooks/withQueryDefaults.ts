import { UseQueryOptions } from '@tanstack/react-query';

export function withQueryDefaults<TData>(
  opts: UseQueryOptions<TData>,
): UseQueryOptions<TData> {
  return {
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
    refetchOnWindowFocus: false,
    ...opts,
  };
}
