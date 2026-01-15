import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchTheNewsApiLatestBySearch } from '@/lib/external/theNewsApi';
import { verifyCronAuth } from '@/lib/utils/verifyCronAuth';
import { THE_NEWS_SECTORS } from '@/constants/keyword';
import { reportError } from '@/lib/core/sentry';

const RATE_LIMIT_DELAY_MS = 2000;

export const GET = verifyCronAuth(async () => {
  try {
    const allItems: Array<{
      uuid: string;
      title: string | null;
      description: string | null;
      url: string | null;
      image_url: string | null;
      source: string | null;
      published_at: string | null;
      content: string | null;
    }> = [];

    // 섹터별로 순차 수집 (Rate Limit 방지: 2초 간격)
    for (const sector of THE_NEWS_SECTORS) {
      try {
        console.log(`📊 [Collect News] Processing sector: ${sector.name} (${sector.id})`);
        const items = await fetchTheNewsApiLatestBySearch({
          search: sector.search,
          limit: 3,
          language: 'en',
          sort: 'published_at',
        });

        let validItems = 0;
        for (const it of items) {
          if (!it?.uuid) continue;
          allItems.push({
            uuid: it.uuid,
            title: (it.title ?? null) as string | null,
            description: ((it.description ?? it.snippet) ?? null) as string | null,
            url: (it.url ?? null) as string | null,
            image_url: (it.image_url ?? null) as string | null,
            source: (it.source ?? null) as string | null,
            published_at: (it.published_at ?? null) as string | null,
            content: ((it.snippet ?? it.description) ?? null) as string | null,
          });
          validItems++;
        }

        console.log(`✅ [Collect News] ${sector.name}: ${validItems}/${items.length} items collected`);
      } catch (err) {
        console.error(`❌ [Collect News] Failed for ${sector.name}:`, err);
      }

      await new Promise((res) => setTimeout(res, RATE_LIMIT_DELAY_MS));
    }

    if (allItems.length === 0) {
      return NextResponse.json({ success: true, message: 'No news found' });
    }

    // uuid 기준 중복 제거
    const uniqueNews = Array.from(
      new Map(allItems.map((item) => [item.uuid, item])).values()
    );

    const { error } = await supabase
      .from('raw_news')
      .upsert(uniqueNews, { onConflict: 'uuid' });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'News collected and upserted successfully',
      count: uniqueNews.length,
      sectors_processed: THE_NEWS_SECTORS.length,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Collect News Error:', error);
    reportError(error, { route: '/api/internal/collect-news' });
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
});
