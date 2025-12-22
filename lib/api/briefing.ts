import { DailyBriefing } from '@/types/briefing';
import { Fetcher } from '@/util/fetcher';

export const fetchBriefing = (id: string) =>
  Fetcher<DailyBriefing>(`/api/briefing/${id}`);
