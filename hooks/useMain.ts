import { useQuery } from '@tanstack/react-query';
import {
  fetchMainBriefing,
  fetchMainMacro,
  fetchMainSector,
  fetchMainKeywords,
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
