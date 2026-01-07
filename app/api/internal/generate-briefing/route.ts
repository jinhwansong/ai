import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/redis/redis';
import { performAIAnalysis } from '@/lib/services/briefing';
import { MacroItem, NewsItem, ObservationItem, SectorItem } from '@/types/services';
import { ANALYSIS_KEYWORDS } from '@/contact/keyword';
import { verifyCronAuth } from '@/util/verifyCronAuth';

export const GET = verifyCronAuth(async () => {
  try {
    // 1. raw_news 테이블에서 최신 뉴스 가져오기 (충분한 풀 확보를 위해 50개)
    const { data: rawNews, error: newsError } = await supabase
      .from('raw_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50);

    if (newsError) throw newsError;

    // 2. 예외 처리: 뉴스가 3개 미만이면 "데이터 부족" 응답 후 종료
    if (!rawNews || rawNews.length < 3) {
      return NextResponse.json({
        success: false,
        message: '데이터 부족 (최소 3개 이상의 뉴스가 필요합니다)',
      });
    }
    
    const { fetchGlobalIndices } = await import('@/lib/api/yahooFinance');
    const globalIndices = await fetchGlobalIndices();
    const marketData = { globalIndices };
    const userPortfolio = {};

    const analysisResult = await performAIAnalysis({
      modelType: 'gemini',
      userKeywords: ANALYSIS_KEYWORDS,
      marketData,
      newsList: rawNews,
      userPortfolio,
    });

    const finalData = {
      ...analysisResult,
      createdAt: new Date().toISOString(),
    };

     // 4. Redis 저장 (dashboard:latest) - 기존 호환성 유지
    await redis.set('dashboard:latest', JSON.stringify(finalData.main));

    // 5. Supabase 개별 테이블 저장 (메인 페이지 API 연동용)
    const sectors = finalData.main.sectorSummary || [];
    const signal = finalData.main.signal;

    await Promise.all([
      // 메인 시그널 저장
      supabase.from('main_signals').insert({
        focus: signal.focus,
        description: signal.description,
        value: signal.value,
        change: signal.change,
        impact_zones: signal.impactZones,
        tags: signal.tags,
      }),

      // 관찰 대상 저장
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


      // 글로벌 매크로 지표 저장
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

      // 섹터 전략 저장
      supabase.from('sector_strategies').insert(
        sectors.map(
          (s: Pick<SectorItem, 'name' | 'signal' | 'momentum' | 'focus'>) => ({
            date: new Date().toISOString().split('T')[0],
            name: s.name,
            stance: s.signal,
            label: s.momentum,
            reason: s.focus,
            type: 'sector',
            guide:
              s.signal === 'POSITIVE'
                ? '비중 확대 정책 유지'
                : '중립적 관점 유지',
          })
        )
      ),

      // 가공 뉴스 저장
      supabase.from('news_articles').upsert(
        (finalData.main.newsHighlights || []).map((n: NewsItem) => ({
          title: n.title,
          summary: n.descriptionShort,
          content: n.contentLong,
          tags: n.tags,
          related_sectors: n.relatedSectors,
          impact: n.impact,
          published_at: new Date().toISOString(),
        })),
        { onConflict: 'title,published_at' }
      ),

      // 전체 이력 저장
      supabase.from('briefing_history').insert({
        data: finalData,
        created_at: new Date().toISOString(),
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Briefing generated and stored in Redis/Supabase successfully',
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Generate Briefing Error:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
});
