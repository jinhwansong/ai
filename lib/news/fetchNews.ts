import { NewsArticle } from "@/types/news";
import { fetchNewsCore } from "./fetchNewsCore";

// 글로벌 경제 뉴스 (데일리 리포트용)
export function fetchDailyNews(): Promise<NewsArticle[]> {
  return fetchNewsCore({
    endpoint: 'top-headlines',
    category: 'business',
    sortBy: 'publishedAt',
    pageSize: 10,
  });
}

// 검색 기반 뉴스
export function fetchSearchNews(keyword: string): Promise<NewsArticle[]> {
  return fetchNewsCore({
    endpoint: 'everything',
    query: keyword,
    sortBy: 'publishedAt',
    pageSize: 10,
  });
}