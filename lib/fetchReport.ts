import type {
  DailyReport,
  NewsArticle,
  SearchNewsResponse,
} from '@/types/news';

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
