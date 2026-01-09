import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
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
} from '@/lib/api/main';
import { withQueryDefaults } from './withQueryDefaults';
import { fetchNewsDetail, fetchNewsList } from '@/lib/api/news';

export const useMainSignal = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-signal'],
      queryFn: fetchMainSignal,
    })
  );

export const useMainBriefing = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-briefing'],
      queryFn: fetchMainBriefing,
    })
  );

export const useMainMacro = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-macro'],
      queryFn: fetchMainMacro,
    })
  );

export const useMainSector = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-sector'],
      queryFn: fetchMainSector,
    })
  );

export const useMainNews = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-news'],
      queryFn: fetchMainNews,
    })
  );

export const useMainObservation = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-observation'],
      queryFn: fetchMainObservation,
    })
  );

export const useMainInsight = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-insight'],
      queryFn: fetchMainInsight,
    })
  );

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
