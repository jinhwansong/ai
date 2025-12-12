import type {
  NewsArticle,
  SearchNewsResponse,
} from '@/types/news';
import { DailyReport } from '@/types/report';

export const fetchDailyReport = async (): Promise<DailyReport> => {
  const res = await fetch('/api/daily/get', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load daily report');
  return res.json();
};

export const fetchSearchNews = async (
  keyword: string
): Promise<SearchNewsResponse> => {
  const res = await fetch(`/api/search-news?q=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error('Failed to fetch search news');
  return res.json();
};

export const fetchSummary = async (keyword: string, news: NewsArticle[]) => {
  const res = await fetch('/api/summary', {
    method: 'POST',
    body: JSON.stringify({ keyword, news }),
  });

  if (!res.ok) throw new Error('Failed to summarize news');
  return res.json();
};

export type TranslateNewsResponse = {
  items: Array<{
    url: string;
    koTitle: string;
    koDescription: string;
  }>;
};

export const fetchTranslateNews = async (
  articles: NewsArticle[]
): Promise<TranslateNewsResponse> => {
  const res = await fetch('/api/translate-news', {
    method: 'POST',
    body: JSON.stringify({ articles }),
  });

  if (!res.ok) throw new Error('Failed to translate news');
  return res.json();
};