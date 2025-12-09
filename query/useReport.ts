import { useQuery } from '@tanstack/react-query';
import { withQueryDefaults } from './withQueryDefaults';
import {
  fetchDailyReport,
  fetchSearchNews,
  fetchSummary,
} from '@/lib/fetchReport';
import type {
  NewsArticle,
  SearchNewsResponse,
  SummaryResult,
} from '@/types/news';
import type { DailyReport } from '@/types/report';

export const useDailyReport = () => {
  return useQuery<DailyReport>(
    withQueryDefaults({
      queryKey: ['daily-report'],
      queryFn: fetchDailyReport,
    })
  );
};

export const useSearchNews = (keyword: string) => {
  return useQuery<SearchNewsResponse>(
    withQueryDefaults({
      queryKey: ['search-news', keyword],
      queryFn: () => fetchSearchNews(keyword),
      enabled: !!keyword,
    })
  );
};

export const useSummary = (keyword: string, news: NewsArticle[]) => {
  return useQuery<SummaryResult>(
    withQueryDefaults({
      queryKey: ['summary', keyword, news],
      queryFn: () => fetchSummary(keyword, news),
      enabled: !!keyword && news.length > 0,
    })
  );
};
