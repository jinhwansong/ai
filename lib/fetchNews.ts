import type { NewsArticle } from '@/types/news';

const API_KEY = process.env.NEWS_API_KEY!;

/**
 * 글로벌 경제 뉴스 가져오기 (데일리 리포트용)
 */
export async function fetchDailyNews(): Promise<NewsArticle[]> {
  const url = `https://newsapi.org/v2/top-headlines?category=business&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('데일리 뉴스 가져오기 실패');

  const data = await res.json();
  return data.articles as NewsArticle[];
}

/**
 * 검색 기반 뉴스 가져오기 (검색용)
 */
export async function fetchSearchNews(keyword: string): Promise<NewsArticle[]> {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    keyword
  )}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('검색한 뉴스 가져오기 실패');

  const data = await res.json();
  return data.articles as NewsArticle[];
}
