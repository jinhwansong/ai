import { NewsArticle } from '@/types/news';
import { fetchNewsCore } from './fetchNewsCore';

// 검색 기반 뉴스
export function fetchSearchNews(keyword: string): Promise<NewsArticle[]> {
  return fetchNewsCore({
    endpoint: 'everything',
    query: keyword,
    sortBy: 'published_at',
    pageSize: 10,
  });
}
