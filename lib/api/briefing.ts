import { Fetcher } from '@/util/fetcher';

export const fetchBriefing = (keywords: string[]) =>
  Fetcher(`/api/ai`, {
    method: 'POST',
    body: JSON.stringify({
      modelType: 'gemini',
      userKeywords: keywords,
    }),
  });
