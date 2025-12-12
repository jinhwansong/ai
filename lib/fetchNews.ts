import type { NewsArticle } from '@/types/news';

const API_KEY = process.env.NEWS_API_KEY;

/**
 * 글로벌 경제 뉴스 가져오기 (데일리 리포트용)
 */
export async function fetchDailyNews(): Promise<NewsArticle[]> {
  if (!API_KEY) throw new Error('NEWS_API_KEY is not set');
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
  if (!API_KEY) throw new Error('NEWS_API_KEY is not set');

  // NOTE:
  // - `language=en` 고정이면 한글 키워드에서 결과가 0건이 되는 경우가 잦습니다.
  // - 검색은 언어 제한을 걸지 않고 최대한 많이 가져오도록 처리합니다.
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
    keyword
  )}&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    // 가능한 경우, NewsAPI 에러 바디를 같이 로깅
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch {}
    console.error('[fetchSearchNews] NewsAPI error', res.status, bodyText);
    throw new Error('검색한 뉴스 가져오기 실패');
  }

  const data = await res.json();
  return data.articles as NewsArticle[];
}
