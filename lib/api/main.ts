import { Fetcher } from '@/util/fetcher';
import { MainBriefing, MainSectorStrategy, MainNewsResponse, MarketIndicesResponse, EconomicIndicatorsResponse, PortfolioResponse } from '@/types/main';
import { MainMacroResponse } from '@/types/macro';

export const fetchMainBriefing = () =>
  Fetcher<MainBriefing>('/api/main/briefing');

export const fetchMainMacro = () =>
  Fetcher<MainMacroResponse>('/api/main/macro');

export const fetchMainSector = () =>
  Fetcher<MainSectorStrategy>('/api/main/sector');

export const fetchMainKeywords = () =>
  Fetcher<MainNewsResponse>('/api/main/keywords');

export const fetchMainMarketIndices = () =>
  Fetcher<MarketIndicesResponse>('/api/main/market-indices');

export const fetchMainEconomicIndicators = () =>
  Fetcher<EconomicIndicatorsResponse>('/api/main/economic-indicators');

export const fetchMainPortfolio = () =>
  Fetcher<PortfolioResponse>('/api/main/portfolio');
