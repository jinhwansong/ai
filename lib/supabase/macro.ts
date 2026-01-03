import { supabase } from '../supabase';

export type GlobalMacroItem = {
  region: string;
  indexName: string;
  value: string;
  change: string;
  status: 'positive' | 'neutral' | 'cautious' | 'negative';
};

export async function getLatestMarketIndicesFromSupabase(): Promise<GlobalMacroItem[]> {
  const { data, error } = await supabase
    .from('market_indices')
    .select('region, index_name, value, change, status')
    .order('updated_at', { ascending: false })
    .limit(4); // 주요 4개 지역

  if (error) {
    console.error('Failed to fetch market indices from Supabase', error);
    throw error;
  }

  return (data || []).map(item => ({
    region: item.region,
    indexName: item.index_name,
    value: item.value,
    change: item.change,
    status: item.status,
  }));
}

export async function saveMarketIndicesToSupabase(items: GlobalMacroItem[]) {
  const rows = items.map(item => ({
    region: item.region,
    index_name: item.indexName,
    value: item.value,
    change: item.change,
    status: item.status,
  }));

  const { error } = await supabase.from('market_indices').insert(rows);

  if (error) {
    console.error('Failed to save market indices to Supabase', error);
    throw error;
  }
}

