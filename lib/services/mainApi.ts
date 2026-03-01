import { MainSectorStrategy, MainNewsResponse, MainSignal, ObservationItem, InsightItem, NewsItem, GlobalMacroItem } from '@/types/main';
import { AnalysisData } from '@/types/news';
import { apiClient } from '../api';

type MainSearchResponse = { news: NewsItem[]; observations: ObservationItem[] };

export const createMainApi = {
  signal: () => apiClient.get<MainSignal>('/api/main/signal'),
  macro: () => apiClient.get<GlobalMacroItem[]>('/api/main/macro'),
  sector: () => apiClient.get<MainSectorStrategy>('/api/main/sector'),
  news: () => apiClient.get<MainNewsResponse>('/api/main/news'),
  observation: () => apiClient.get<ObservationItem[]>('/api/main/observation'),
  insight: () => apiClient.get<InsightItem>('/api/main/insight'),
  signalDetail: () => apiClient.get<AnalysisData>('/api/main/analysis'),
  search: (query: string) =>
    apiClient.get<MainSearchResponse>('/api/main/search', { q: query }),
};