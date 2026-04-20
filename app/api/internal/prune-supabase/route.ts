import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyCronAuth } from '@/lib/utils/verifyCronAuth';
import { apiError } from '@/lib/errors/apiResponse';
import { reportError } from '@/lib/core/sentry';

const RETENTION_DAYS = 7;

export const GET = verifyCronAuth(async () => {
  const cutoff = new Date(
    Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  try {
    const { error: rawErr, count: rawCount } = await supabase
      .from('raw_news')
      .delete({ count: 'exact' })
      .lt('created_at', cutoff);

    if (rawErr) throw rawErr;

    const { error: briefErr, count: briefCount } = await supabase
      .from('briefing_history')
      .delete({ count: 'exact' })
      .lt('created_at', cutoff);

    if (briefErr) throw briefErr;

    const { error: newsErr, count: newsCount } = await supabase
      .from('news_articles')
      .delete({ count: 'exact' })
      .lt('published_at', cutoff);

    if (newsErr) throw newsErr;

    return NextResponse.json({
      success: true,
      cutoff,
      deleted: {
        raw_news: rawCount ?? 0,
        briefing_history: briefCount ?? 0,
        news_articles: newsCount ?? 0,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Prune Supabase Error:', error);
    reportError(error, { route: '/api/internal/prune-supabase' });
    return apiError(errorMessage, 500);
  }
});
