import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/core/redis';
import { performAIAnalysis } from '@/lib/services/briefing';
import { ObservationItem, SectorItem } from '@/types/services';
import { ANALYSIS_KEYWORDS } from '@/constants/keyword';
import { verifyCronAuth } from '@/lib/utils/verifyCronAuth';
import { detectTimeSlotFromCron, getTimeSlotRedisKey } from '@/lib/utils/timeSlot';
import { fetchGlobalIndices } from '@/lib/external/yahooFinance';
import { reportError } from '@/lib/core/sentry';

function getStringProp(obj: unknown, key: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  const record = obj as Record<string, unknown>;
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

export const GET = verifyCronAuth(async () => {
  let progressKey: string | null = null;

  try {
    // 1. raw_news 테이블에서 최신 뉴스 가져오기
    const { data: rawNews, error: newsError } = await supabase
      .from('raw_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(36);

    if (newsError) throw newsError;

    if (!rawNews || rawNews.length < 3) {
      return NextResponse.json({
        success: false,
        message: '데이터 부족 (최소 3개 이상의 뉴스가 필요합니다)',
      });
    }
    
    const globalIndices = await fetchGlobalIndices();
    const marketData = { globalIndices };

    // 영역별 모델 분리:
    // - Gemini: news/sector (대량 텍스트 가공/요약)
    // - OpenAI: impact/observation/insight (JSON 구조 안정성)
    // 단, OPENAI_API_KEY가 없으면 안전하게 전체 Gemini로 동작
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

    // 분석 진행 상태를 Redis에 저장 (중간 결과 추적 및 타임아웃 복구용)
    progressKey = `briefing:progress:${Date.now()}`;
    await redis.set(progressKey, JSON.stringify({
      status: 'started',
      timestamp: new Date().toISOString(),
      newsCount: rawNews?.length || 0,
      hasOpenAI,
    }), 'EX', 3600); // 1시간 유지

    const analysisResult = await performAIAnalysis({
      modelType: 'gemini',
      modelPlan: hasOpenAI
        ? {
            news: 'gemini',
            sector: 'gemini',
            impact: 'gpt',
            observation: 'gpt',
            insight: 'gpt',
          }
        : undefined,
      userKeywords: ANALYSIS_KEYWORDS,
      marketData,
      newsList: rawNews,
    });

    // 성공 시 진행 상태 업데이트
    await redis.set(
      progressKey,
      JSON.stringify({
        status: 'completed',
        timestamp: new Date().toISOString(),
        sections: ['sector', 'news', 'impact', 'observation', 'insight'],
      }),
      'EX',
      3600
    );

    console.log('✅ [Generate Briefing] Analysis completed successfully');

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
    const finishReason = getStringProp(error, 'finish_reason');
    const task = getStringProp(error, 'task');

    // 진행 상태에 에러 정보 업데이트
    if (progressKey) {
      try {
        const errorInfo = {
          status: 'failed',
          error: errorMessage,
          timestamp: new Date().toISOString(),
          finishReason,
          task,
        };
        await redis.set(progressKey, JSON.stringify(errorInfo), 'EX', 7200); // 실패 정보는 2시간 유지
      } catch (redisError) {
        console.error('Failed to save error state to Redis:', redisError);
      }
    }

    console.error('❌ [Generate Briefing] Analysis failed:', error);
    reportError(error, { route: '/api/internal/generate-briefing', finishReason });

    // finish_reason이 length인 경우 사용자에게 더 명확한 메시지 제공
    if (finishReason === 'length') {
      const userFriendlyMessage = 'AI 분석 중 응답이 너무 길어져 생성이 중단되었습니다. 뉴스 데이터 양을 줄이거나 잠시 후 다시 시도해주세요.';
      return NextResponse.json({
        success: false,
        error: userFriendlyMessage,
        details: errorMessage,
        suggestion: '데이터가 너무 많습니다. 최근 뉴스로 제한하거나 배치 크기를 줄여보세요.'
      }, { status: 413 }); // Payload Too Large
    }

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
});
