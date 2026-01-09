import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/redis/redis';
import { performAIAnalysis } from '@/lib/services/briefing';
import { MacroItem, ObservationItem, SectorItem } from '@/types/services';
import { ANALYSIS_KEYWORDS } from '@/contact/keyword';
import { verifyCronAuth } from '@/util/verifyCronAuth';
import { detectTimeSlotFromCron, getTimeSlotRedisKey } from '@/util/timeSlot';
import { fetchGlobalIndices } from '@/lib/api/yahooFinance';

export const GET = verifyCronAuth(async () => {
  try {
    // 1. raw_news 테이블에서 최신 뉴스 가져오기
    const { data: rawNews, error: newsError } = await supabase
      .from('raw_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50);

    if (newsError) throw newsError;

    if (!rawNews || rawNews.length < 3) {
      return NextResponse.json({
        success: false,
        message: '데이터 부족 (최소 3개 이상의 뉴스가 필요합니다)',
      });
    }
    
    const globalIndices = await fetchGlobalIndices();
    const marketData = { globalIndices };

    const analysisResult = await performAIAnalysis({
      modelType: 'gemini',
      userKeywords: ANALYSIS_KEYWORDS,
      marketData,
      newsList: rawNews,
    });

    const finalData = {
      ...analysisResult,
      createdAt: new Date().toISOString(),
    };

    // 2. 가공 뉴스 DB 저장 및 ID 추출
    const { data: insertedNews, error: upsertError } = await supabase
      .from('news_articles')
      .upsert(
        (finalData.main.newsHighlights || []).map((n) => ({
          title: n.title,
          summary: n.descriptionShort,
          content: n.contentLong,
          checkpoints: n.checkpoints,
          tags: n.tags,
          related_sectors: n.relatedSectors,
          impact: n.impact,
          source: n.source || 'AI분석',
          url: n.url || null,
          published_at: new Date().toISOString(),
        })),
        { onConflict: 'title,published_at' }
      )
      .select('id, title'); // 생성된 ID와 매칭용 제목 가져오기

    if (upsertError) throw upsertError;

    // 3. Redis 데이터에 ID 매칭
    if (insertedNews && finalData.main.newsHighlights) {
      finalData.main.newsHighlights = finalData.main.newsHighlights.map((n) => {
        const dbNews = insertedNews.find((db: { title: string; id: string }) => db.title === n.title);
        return {
          ...n,
          id: dbNews?.id // DB에서 생성된 ID 추가
        };
      });
    }

    // 4. 현재 시간대 감지 및 Redis 저장 (ID가 포함된 데이터)
    const timeSlot = detectTimeSlotFromCron();
    const timeSlotKey = getTimeSlotRedisKey(timeSlot);
    
    await redis.set(timeSlotKey, JSON.stringify(finalData.main), 'EX', 86400);
    await redis.set('dashboard:latest', JSON.stringify(finalData.main), 'EX', 86400);
    
    // 5. 나머지 정보 Supabase 개별 테이블 저장
    const sectors = finalData.main.sectorSummary || [];
    const signal = finalData.main.signal;

    await Promise.all([
      supabase.from('main_signals').insert({
        focus: signal.focus,
        description: signal.description,
        value: signal.value,
        change: signal.change,
        impact_zones: signal.impactZones,
        tags: signal.tags,
      }),
      supabase.from('observation_items').insert(
        (finalData.main.observations || []).map((o: ObservationItem) => ({
          symbol: o.symbol,
          name: o.name,
          type: o.type,
          reason: o.reason,
          tags: o.tags,
          momentum: o.momentum,
        }))
      ),
      supabase.from('market_indices').insert(
        (finalData.main.macro || []).map((m: MacroItem) => ({
          region: m.region,
          index_name: m.indexName,
          value: m.value,
          change: m.change,
          status: m.status.toLowerCase(),
          ai_analysis: m.aiAnalysis,
        }))
      ),
      supabase.from('sector_strategies').insert(
        sectors.map((s: Pick<SectorItem, 'name' | 'signal' | 'momentum' | 'focus'>) => ({
          date: new Date().toISOString().split('T')[0],
          name: s.name,
          stance: s.signal,
          label: s.momentum,
          reason: s.focus,
          type: 'sector',
          guide: s.signal === 'POSITIVE' ? '비중 확대 정책 유지' : '중립적 관점 유지',
        }))
      ),
      supabase.from('briefing_history').insert({
        data: finalData,
        created_at: new Date().toISOString(),
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Briefing generated and stored with News IDs successfully',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Generate Briefing Error:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
});
