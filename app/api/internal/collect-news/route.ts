import { NextResponse } from 'next/server';
import { apiError } from '@/lib/errors/apiResponse';
import { supabase } from '@/lib/supabase';
import { verifyCronAuth } from '@/lib/utils/verifyCronAuth';
import { THE_NEWS_SECTORS } from '@/constants';
import { reportError } from '@/lib/core/sentry';
import {
  fetchAllRSSFeeds,
  filterNewsByKeywords,
  type RSSFeedItem,
} from '@/lib/external/rssFeeds';

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
    const threeDaysAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    // 1. RSS 피드에서 전체 뉴스 수집
    console.log('📡 [Collect News] Starting RSS feed collection...');
    let rssItems: RSSFeedItem[] = [];
    try {
      rssItems = await fetchAllRSSFeeds(25); // 피드당 최대 25개
      console.log(`✅ [Collect News] RSS: Collected ${rssItems.length} items`);
    } catch (error) {
      console.error('❌ [Collect News] RSS collection failed:', error);
    }

    // 2. 섹터별로 RSS에서 필터링
    for (const sector of THE_NEWS_SECTORS) {
      try {
        console.log(
          `📊 [Collect News] Processing sector: ${sector.name} (${sector.id})`,
        );

        // RSS에서 섹터별 키워드로 필터링
        const keywords = sector.search
          .split(' OR ')
          .map((k) => k.trim())
          .filter((k) => k.length > 0);

        const filteredRSS = filterNewsByKeywords(rssItems, keywords)
          .filter((item) => {
            // 최근 3일 이내만
            if (!item.published_at) return false;
            const published = new Date(item.published_at);
            return published >= threeDaysAgo;
          })
          .slice(0, 4); // 섹터당 최대 4개

        // RSS에서 충분한 뉴스가 없으면 The News API 사용
        // if (filteredRSS.length < 3) {
        //   const formattedDate = threeDaysAgo.toISOString().split('T')[0];
        //   const apiItems = await fetchTheNewsApiLatestBySearch({
        //     search: sector.search,
        //     limit: 3 - filteredRSS.length,
        //     language: 'en',
        //     sort: 'published_at',
        //     published_after: formattedDate,
        //   });

        //   for (const it of apiItems) {
        //     if (!it?.uuid) continue;
        //     allItems.push({
        //       uuid: it.uuid,
        //       title: (it.title ?? null) as string | null,
        //       description: (it.description ?? it.snippet ?? null) as
        //         | string
        //         | null,
        //       url: (it.url ?? null) as string | null,
        //       image_url: (it.image_url ?? null) as string | null,
        //       source: (it.source ?? null) as string | null,
        //       published_at: (it.published_at ?? null) as string | null,
        //       content: (it.snippet ?? it.description ?? null) as string | null,
        //     });
        //   }
        // }

        // RSS에서 필터링된 뉴스 추가
        allItems.push(...filteredRSS);

        console.log(
          `✅ [Collect News] ${sector.name}: ${filteredRSS.length} items from RSS`,
        );

        await new Promise((res) => setTimeout(res, RATE_LIMIT_DELAY_MS));
      } catch (err) {
        console.error(`❌ [Collect News] Failed for ${sector.name}:`, err);
      }
    }
    // 섹터별로 순차 수집 (Rate Limit 방지: 2초 간격)
    // for (const sector of THE_NEWS_SECTORS) {
    //   try {
    //     console.log(
    //       `📊 [Collect News] Processing sector: ${sector.name} (${sector.id})`,
    //     );
    //     const items = await fetchTheNewsApiLatestBySearch({
    //       search: sector.search,
    //       limit: 3,
    //       language: 'en',
    //       sort: 'published_at',
    //       published_after: formattedDate,
    //     });

    //     let validItems = 0;
    //     for (const it of items) {
    //       if (!it?.uuid) continue;

    //       allItems.push({
    //         uuid: it.uuid,
    //         title: (it.title ?? null) as string | null,
    //         description: (it.description ?? it.snippet ?? null) as
    //           | string
    //           | null,
    //         url: (it.url ?? null) as string | null,
    //         image_url: (it.image_url ?? null) as string | null,
    //         source: (it.source ?? null) as string | null,
    //         published_at: (it.published_at ?? null) as string | null,
    //         content: (it.snippet ?? it.description ?? null) as string | null,
    //       });
    //       validItems++;
    //     }

    //     console.log(
    //       `✅ [Collect News] ${sector.name}: ${validItems}/${items.length} items collected`,
    //     );
    //   } catch (err) {
    //     console.error(`❌ [Collect News] Failed for ${sector.name}:`, err);
    //   }

    //   await new Promise((res) => setTimeout(res, RATE_LIMIT_DELAY_MS));
    // }

    if (allItems.length === 0) {
      return NextResponse.json({ success: true, message: 'No news found' });
    }

    console.log('📊 [Collect News] Summary:');
    console.log('  - Total items collected:', allItems.length);
    console.log('  - Unique UUIDs:', new Set(allItems.map((i) => i.uuid)).size);
    console.log('  - Unique URLs:', new Set(allItems.map((i) => i.url)).size);
    console.log(
      '  - Unique titles:',
      new Set(allItems.map((i) => i.title)).size,
    );
    // uuid 기준 중복 제거
    const uniqueNews = Array.from(
      new Map(allItems.map((item) => [item.uuid, item])).values(),
    );
    console.log('  - Unique items (by UUID, this run):', uniqueNews.length);

    // 기존 뉴스 확인 (새로 추가된 뉴스만 카운트)
    const { data: existingNews } = await supabase
      .from('raw_news')
      .select('uuid')
      .in(
        'uuid',
        uniqueNews.map((n) => n.uuid),
      );

    const existingUuids = new Set((existingNews || []).map((n) => n.uuid));
    const newNews = uniqueNews.filter((n) => !existingUuids.has(n.uuid));
    const newNewsCount = newNews.length;
    console.log('  - New items (not in DB):', newNewsCount);

    const { error } = await supabase
      .from('raw_news')
      .upsert(uniqueNews, { onConflict: 'uuid' });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'News collected and upserted successfully',
      count: uniqueNews.length,
      newNewsCount, // 새로 추가된 뉴스 개수
      sectors_processed: THE_NEWS_SECTORS.length,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Collect News Error:', error);
    reportError(error, { route: '/api/internal/collect-news' });
    return apiError(errorMessage, 500);
  }
});
