import { NewsListResponse, NewsArticle } from '@/types/main';
import { apiClient } from '../api';

export const createNewsApi = {
  list: (params: {
    sort: string;
    category: string;
    period: string;
    page: number;
    limit: number;
  }) =>
    apiClient.get<NewsListResponse>('/api/news/list', {
      sort: params.sort,
      category: params.category,
      period: params.period,
      page: params.page,
      limit: params.limit,
    }),
  detail: (id: string) => apiClient.get<NewsArticle>(`/api/news/${id}`),
};
