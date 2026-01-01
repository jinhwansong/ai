import { supabase } from '../supabase';
import type { DailyBriefing } from '@/types/briefing';

export async function saveNewsToSupabase(briefing: DailyBriefing) {
  const rows = briefing.news.map((n) => ({
    title: n.title,
    summary: n.descriptionShort,
    content: n.contentLong,
    tags: n.tags,
    published_at: `${briefing.signal.date} ${briefing.signal.publishTime}`,
    source: 'ai-briefing',
  }));

  if (rows.length === 0) return;

   const { error } = await supabase.from('news_articles').upsert(rows, {
     onConflict: 'title,published_at',
   });

  if (error) {
    console.error('Failed to save news to Supabase', error);
    throw error;
  }
}

// Supabase에서 뉴스 조회 함수들
export async function getLatestNewsFromSupabase(limit = 10) {
  const { data, error } = await supabase
    .from('news_articles')
    .select('title, summary, content, tags, published_at, source')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch news from Supabase', error);
    throw error;
  }

  return data || [];
}

export async function getNewsByTagFromSupabase(tag: string, limit = 20) {
  const { data, error } = await supabase
    .from('news_articles')
    .select('title, summary, content, tags, published_at, source')
    .contains('tags', [tag])
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch news by tag from Supabase', error);
    throw error;
  }

  return data || [];
}

export async function getTodaysNewsFromSupabase(date: string, limit = 3) {
  const startOfDay = `${date} 00:00:00`;
  const endOfDay = `${date} 23:59:59`;

  const { data, error } = await supabase
    .from('news_articles')
    .select('title, summary, tags, published_at, source')
    .gte('published_at', startOfDay)
    .lte('published_at', endOfDay)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to fetch today\'s news from Supabase', error);
    throw error;
  }

  return data || [];
}