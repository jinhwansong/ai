import { Fetcher } from '@/util/fetcher';
import { MainBriefing, MainSectorStrategy, MainNewsResponse,  MainSignal, ObservationItem, InsightItem } from '@/types/main';
import { MainMacroResponse } from '@/types/macro';
import { AnalysisData } from '@/types/news';

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

export const fetchMainObservation = () =>
  Fetcher<ObservationItem[]>('/api/main/observation');

export const fetchMainInsight = () =>
  Fetcher<InsightItem>('/api/main/insight');


export const fetchSignalDetail = () => Fetcher<AnalysisData>('/api/main/analysis');

