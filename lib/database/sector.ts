import { supabase } from '../supabase';
import { MainSectorStrategy } from '@/types/main';

export async function getLatestSectorStrategyFromSupabase(): Promise<MainSectorStrategy | null> {
  const { data, error } = await supabase
    .from('sector_strategies')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch sector strategies from Supabase', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return null;
  }

  // 최신 날짜의 데이터만 필터링
  const latestDate = data[0].date;
  const items = data
    .filter((item) => item.date === latestDate)
    .map((item) => ({
      type: item.type,
      name: item.name,
      stance: item.stance,
      label: item.label,
      reason: item.reason,
      guide: item.guide,
    }));

  return {
    date: latestDate,
    items: items 
  };
}

export async function saveSectorStrategiesToSupabase(
  date: string,
  items: MainSectorStrategy['items']
) {
  const rows = items.map((item) => ({
    date,
    type: item.type,
    name: item.name,
    stance: item.stance,
    label: item.label,
    reason: item.reason,
    guide: item.guide,
  }));

  const { error } = await supabase.from('sector_strategies').insert(rows);

  if (error) {
    console.error('Failed to save sector strategies to Supabase', error);
    throw error;
  }
}

