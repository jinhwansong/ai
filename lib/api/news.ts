import { NewsListResponse, NewsArticle } from '@/types/main';
import { Fetcher } from "@/util/fetcher";

export const fetchNewsList = (params: {
  sort: string;
  category: string;
  period: string;
  page: number;
  limit: number;
}) => {
  const query = new URLSearchParams({
    sort: params.sort,
    category: params.category,
    period: params.period,
    page: params.page.toString(),
    limit: params.limit.toString(),
  });
  return Fetcher<NewsListResponse>(`/api/news/list?${query.toString()}`);
};

export const fetchNewsDetail = (id: string) => Fetcher<NewsArticle>(`/api/news/${id}`);
