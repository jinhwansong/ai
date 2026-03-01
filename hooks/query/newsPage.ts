import {
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
  useQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { api } from '@/lib/services';
import { withQueryDefaults } from '../withQueryDefaults';
import { mainQueryKeys, NewsListFilters } from './queryKeys';

export type UseInfiniteNewsListParams = NewsListFilters & {
  enabled?: boolean;
};

type NewsListPageResult = Awaited<ReturnType<typeof api.news.list>>;

export const useInfiniteNewsList = ({
  enabled = true,
  ...filters
}: UseInfiniteNewsListParams) =>
  useInfiniteQuery({
    queryKey: mainQueryKeys.newsList(filters),
    queryFn: ({ pageParam = 1 }) =>
      api.news.list({
        ...filters,
        page: pageParam as number,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });

export const useSuspenseInfiniteNewsList = ({
  ...filters
}: Omit<UseInfiniteNewsListParams, 'enabled'>) =>
  useSuspenseInfiniteQuery({
    queryKey: mainQueryKeys.newsList(filters),
    queryFn: ({ pageParam = 1 }) =>
      api.news.list({
        ...filters,
        page: pageParam as number,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    select: (data) => ({
      ...data,
      flatItems: data.pages.flatMap((page: NewsListPageResult) => page.data),
    }),
  });

export const useNewsDetail = (id: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: mainQueryKeys.newsDetail(id),
      queryFn: () => api.news.detail(id),
      enabled: !!id,
    })
  );

export const useSuspenseNewsDetail = (id: string) =>
  useSuspenseQuery({
    queryKey: mainQueryKeys.newsDetail(id),
    queryFn: () => api.news.detail(id),
  });
