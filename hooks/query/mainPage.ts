import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { GlobalMacroItem } from '@/types/main';
import { withQueryDefaults } from '../withQueryDefaults';
import { api } from '@/lib/services';
import { mainQueryKeys } from './queryKeys';

export const useMainSignal = () =>
  useSuspenseQuery({
    queryKey: mainQueryKeys.signal,
    queryFn: api.main.signal,
  });

export const useMainMacro = () =>
  useSuspenseQuery<GlobalMacroItem[]>({
    queryKey: mainQueryKeys.macro,
    queryFn: api.main.macro,
  });

export const useMainSector = () =>
  useSuspenseQuery({
    queryKey: mainQueryKeys.sector,
    queryFn: api.main.sector,
  });

export const useMainNews = () =>
  useSuspenseQuery({
    queryKey: mainQueryKeys.news,
    queryFn: api.main.news,
  });

export const useMainObservation = () =>
  useSuspenseQuery({
    queryKey: mainQueryKeys.observation,
    queryFn: api.main.observation,
  });

export const useMainInsight = () =>
  useSuspenseQuery({
    queryKey: mainQueryKeys.insight,
    queryFn: api.main.insight,
  });

export const useSignalDetail = () =>
  useQuery(
    withQueryDefaults({
      queryKey: mainQueryKeys.signalDetailBase,
      queryFn: api.main.signalDetail,
    })
  );

export const useSuspenseSignalDetail = () =>
  useSuspenseQuery({
    queryKey: mainQueryKeys.signalDetailBase,
    queryFn: api.main.signalDetail,
  });
