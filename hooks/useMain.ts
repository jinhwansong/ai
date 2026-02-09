import { useQuery, useInfiniteQuery, useSuspenseQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import {
  fetchMainBriefing,
  fetchMainMacro,
  fetchMainSector,
  fetchMainNews,
  fetchMainSignal,
  fetchMainObservation,
  fetchMainInsight,
  fetchSignalDetail,
  fetchSearchResults,
} from '@/lib/services/mainApi';
import { withQueryDefaults } from './withQueryDefaults';
import { fetchNewsDetail, fetchNewsList } from '@/lib/services/newsApi';
import { GlobalMacroItem } from '@/types/main';

export const useMainSignal = () =>
  useSuspenseQuery({
    queryKey: ['main-signal'],
    queryFn: fetchMainSignal,
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useMainBriefing = () =>
  useSuspenseQuery({
    queryKey: ['main-briefing'],
    queryFn: fetchMainBriefing,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useMainMacro = () =>
  useSuspenseQuery<GlobalMacroItem[]>({
    queryKey: ['main-macro'],
    queryFn: fetchMainMacro,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useMainSector = () =>
  useSuspenseQuery({
    queryKey: ['main-sector'],
    queryFn: fetchMainSector,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useMainNews = () =>
  useSuspenseQuery({
    queryKey: ['main-news'],
    queryFn: fetchMainNews,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useMainObservation = () =>
  useSuspenseQuery({
    queryKey: ['main-observation'],
    queryFn: fetchMainObservation,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useMainInsight = () =>
  useSuspenseQuery({
    queryKey: ['main-insight'],
    queryFn: fetchMainInsight,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useSignalDetail = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['signal-detail'],
      queryFn: fetchSignalDetail,
    })
  );

export const useSuspenseSignalDetail = () =>
  useSuspenseQuery({
    queryKey: ['signal-detail'],
    queryFn: fetchSignalDetail,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export type UseInfiniteNewsListParams = {
  sort: string;
  category: string;
  period: string;
  enabled?: boolean;
};

export const useInfiniteNewsList = ({
  enabled = true,
  ...filters
}: UseInfiniteNewsListParams) =>
  useInfiniteQuery({
    queryKey: ['news-list', filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchNewsList({
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
    queryKey: ['news-list', filters],
    queryFn: ({ pageParam = 1 }) =>
      fetchNewsList({
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
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useNewsDetail = (id: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: ['news-detail', id],
      queryFn: () => fetchNewsDetail(id),
      enabled: !!id,
    })
  );

export const useSuspenseNewsDetail = (id: string) =>
  useSuspenseQuery({
    queryKey: ['news-detail', id],
    queryFn: () => fetchNewsDetail(id),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });

export const useSearch = (query: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: ['search', query],
      queryFn: () => fetchSearchResults(query),
      enabled: !!query,
    })
  );

export const useSuspenseSearch = (query: string) =>
  useSuspenseQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSearchResults(query),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
  });
