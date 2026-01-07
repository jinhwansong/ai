import { supabase } from '../supabase';
import { MainSignal } from '@/types/main';

export async function getLatestSignalFromSupabase(): Promise<MainSignal | null> {
  const { data, error } = await supabase
    .from('main_signals')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 데이터가 없는 경우
      return null;
    }
    console.error('Failed to fetch latest signal from Supabase', error);
    throw error;
  }

  return {
    focus: data.focus,
    description: data.description,
    value: data.value,
    change: data.change,
    impactZones: data.impact_zones ?? [],
    tags: data.tags,
    updatedAt: data.updated_at,
  };
}

export async function saveSignalToSupabase(signal: Omit<MainSignal, 'updatedAt'>) {
  const { error } = await supabase.from('main_signals').insert({
    focus: signal.focus,
    description: signal.description,
    value: signal.value,
    change: signal.change,
    impact_zones: signal.impactZones,
    tags: signal.tags,
  });

  if (error) {
    console.error('Failed to save signal to Supabase', error);
    throw error;
  }
}
