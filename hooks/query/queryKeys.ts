export type NewsListFilters = {
  sort: string;
  category: string;
  period: string;
};

export const mainQueryKeys = {
  signal: ['main-signal'] as const,
  macro: ['main-macro'] as const,
  sector: ['main-sector'] as const,
  news: ['main-news'] as const,
  observation: ['main-observation'] as const,
  insight: ['main-insight'] as const,
  signalDetailBase: ['signal-detail'] as const,
  newsList: (filters: NewsListFilters) => ['news-list', filters] as const,
  newsDetail: (id: string) => ['news-detail', id] as const,
  search: (query: string) => ['search', query] as const,
};
