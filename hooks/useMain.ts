import { useQuery } from '@tanstack/react-query';
import {
  fetchMainBriefing,
  fetchMainMacro,
  fetchMainSector,
  fetchMainKeywords,
  fetchMainMarketIndices,
  fetchMainEconomicIndicators,
  fetchMainPortfolio,
} from '@/lib/api/main';
import { withQueryDefaults } from './withQueryDefaults';

export const useMainBriefing = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-briefing'],
      queryFn: fetchMainBriefing,
    })
  );

export const useMainMacro = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-macro'],
      queryFn: fetchMainMacro,
    })
  );

export const useMainSector = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-sector'],
      queryFn: fetchMainSector,
    })
  );

export const useMainKeywords = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-keywords'],
      queryFn: fetchMainKeywords,
    })
  );

export const useMainMarketIndices = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-market-indices'],
      queryFn: fetchMainMarketIndices,
    })
  );

export const useMainEconomicIndicators = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-economic-indicators'],
      queryFn: fetchMainEconomicIndicators,
    })
  );

export const useMainPortfolio = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-portfolio'],
      queryFn: fetchMainPortfolio,
    })
  );
