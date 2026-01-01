import { supabase } from '../supabase';
import type { DailyBriefing } from '@/types/briefing';

export async function saveBriefingToSupabase(briefing: DailyBriefing) {
  const signal = briefing.signal;

  const { error } = await supabase.from('daily_briefings').upsert(
    {
      date: signal.date,
      publish_time: signal.publishTime,
      title: signal.title,
      summary: signal.summaryLong,
    },
    {
      onConflict: 'date',
    }
  );

  if (error) {
    console.error('Failed to save briefing to Supabase', error);
    throw error;
  }
}

// Supabase에서 브리핑 조회 함수들
export async function getBriefingFromSupabase(date: string) {
  const { data, error } = await supabase
    .from('daily_briefings')
    .select('*')
    .eq('date', date)
    .single();

  if (error) {
    console.error('Failed to fetch briefing from Supabase', error);
    throw error;
  }

  return data;
}

export async function getLatestBriefingFromSupabase() {
  const { data, error } = await supabase
    .from('daily_briefings')
    .select('*')
    .order('date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error('Failed to fetch latest briefing from Supabase', error);
    throw error;
  }

  return data;
}