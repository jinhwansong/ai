import { DailyStrategy } from '@/types/strategy';
import { Fetcher } from '@/util/fetcher';

export const fetchStrategy = (id: string) =>
  Fetcher<DailyStrategy>(`/api/strategy/${id}`);
