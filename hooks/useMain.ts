import { useQuery, useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
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

export const useInfiniteNewsList = (params: { 
  sort: string; 
  category: string; 
  period: string; 
}) => {
  return useInfiniteQuery({
    queryKey: ['news-list', params],
    queryFn: ({ pageParam = 1 }) => 
      fetchNewsList({ ...params, page: pageParam as number, limit: 10 }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNext) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useNewsDetail = (id: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: ['news-detail', id],
      queryFn: () => fetchNewsDetail(id),
      enabled: !!id,
    })
  );

export const useSearch = (query: string) =>
  useQuery(
    withQueryDefaults({
      queryKey: ['search', query],
      queryFn: () => fetchSearchResults(query),
      enabled: !!query,
    })
  );
