import type { FetchNewsParams, NewsArticle } from '@/types/news';

const API_KEY = process.env.NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2';

export async function fetchNewsCore(
  params: FetchNewsParams
): Promise<NewsArticle[]> {
  if (!API_KEY) throw new Error('NEWS_API_KEY is not set');

  const url = new URL(`${BASE_URL}/${params.endpoint}`);

  if (params.query) url.searchParams.set('q', params.query);
  if (params.category) url.searchParams.set('category', params.category);

  url.searchParams.set('language', params.language ?? 'en');
  url.searchParams.set('pageSize', String(params.pageSize ?? 10));
  if (params.sortBy) url.searchParams.set('sortBy', params.sortBy);

  url.searchParams.set('apiKey', API_KEY);

  const res = await fetch(url.toString(), { cache: 'no-store' });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[fetchNewsCore] error', res.status, body);
    throw new Error('NewsAPI request failed');
  }

  const data = await res.json();
  return data.articles as NewsArticle[];
}
