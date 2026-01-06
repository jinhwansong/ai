import { useQuery } from '@tanstack/react-query';
import {
  fetchMainBriefing,
  fetchMainMacro,
  fetchMainSector,
  fetchMainNews,
  fetchMainSignal,
} from '@/lib/api/main';
import { withQueryDefaults } from './withQueryDefaults';

export const useMainSignal = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-signal'],
      queryFn: fetchMainSignal,
    })
  );

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

export const useMainNews = () =>
  useQuery(
    withQueryDefaults({
      queryKey: ['main-news'],
      queryFn: fetchMainNews,
    })
  );
