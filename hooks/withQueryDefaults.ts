import { UseQueryOptions } from '@tanstack/react-query';

export function withQueryDefaults<TData>(
  opts: UseQueryOptions<TData>
): UseQueryOptions<TData> {
  return {
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
    refetchOnWindowFocus: false,
    // Suspense와 함께 사용하기 위해 throwOnError는 각 쿼리에서 개별 설정
    ...opts,
  };
}
