import { Fetcher } from '@/util/fetcher';
import { MainBriefing, MainSectorStrategy, MainNewsResponse,  MainSignal } from '@/types/main';
import { MainMacroResponse } from '@/types/macro';

export const fetchMainSignal = () =>
  Fetcher<MainSignal>('/api/main/signal');

export const fetchMainBriefing = () =>
  Fetcher<MainBriefing>('/api/main/briefing');

export const fetchMainMacro = () =>
  Fetcher<MainMacroResponse>('/api/main/macro');

export const fetchMainSector = () =>
  Fetcher<MainSectorStrategy>('/api/main/sector');

export const fetchMainNews = () =>
  Fetcher<MainNewsResponse>('/api/main/news');


