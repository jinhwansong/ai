import { Fetcher } from '@/util/fetcher';
import { MainBriefing, MainSectorStrategy } from '@/types/main';
import { MainMacroResponse } from '@/types/macro';

export const fetchMainBriefing = () =>
  Fetcher<MainBriefing>('/api/main/briefing');

export const fetchMainMacro = () =>
  Fetcher<MainMacroResponse>('/api/main/macro');

export const fetchMainSector = () =>
  Fetcher<MainSectorStrategy>('/api/main/sector');

export const fetchMainKeywords = () =>
  Fetcher<{ keywords: { tag: string; active: boolean }[] }>(
    '/api/main/keywords'
  );
