import { Fetcher } from '@/util/fetcher';

export const searchKeyword = (keyword: string) =>
  Fetcher<{ tag: string }>('/api/internal/generate-keyword', {
    method: 'POST',
    body: JSON.stringify({ keyword }),
  });

export const fetchKeywordResult = (tag: string) =>
  Fetcher(`/api/keyword/${tag}`);
