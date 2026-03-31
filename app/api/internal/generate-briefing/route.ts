import { NextResponse } from 'next/server';
import { apiError } from '@/lib/errors/apiResponse';
import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/core/redis';
import { performAIAnalysis } from '@/lib/services/briefing';
import { ObservationItem, SectorItem } from '@/types/services';
import { ANALYSIS_KEYWORDS } from '@/constants';
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

function truncateText(input: unknown, maxLen: number): string | null {
  if (typeof input !== 'string') return null;
  const s = input.trim();
  if (!s) return null;
  if (s.length <= maxLen) return s;
  return `${s.slice(0, Math.max(0, maxLen - 1))}…`;
}

function compactNewsForPrompt(newsList: Array<Record<string, unknown>>) {
  return newsList.map((n) => ({
    uuid: n.uuid ?? null,
    published_at: n.published_at ?? null,
    source: truncateText(n.source, 50),
    title: truncateText(n.title, 150),
    description: truncateText(n.description ?? n.content, 200),
    url: n.url ?? null,
  }));
}

export const GET = verifyCronAuth(async () => {
  let progressKey: string | null = null;

  try {
    // 최근 2시간 이내에 추가된 새 뉴스만 가져오기 (비용 절감)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    
    const { data: rawNews, error: newsError } = await supabase
      .from('raw_news')
      .select('*')
      .gte('created_at', twoHoursAgo) // 최근 2시간 이내 추가된 뉴스만
      .order('published_at', { ascending: false })
      .limit(36); // 섹터 증가·수집량 대응

    if (newsError) throw newsError;

    // 새 뉴스가 없으면 스킵
    if (!rawNews || rawNews.length === 0) {
      console.log('⚠️ [Generate Briefing] No new news found in the last 2 hours. Skipping.');
      return NextResponse.json({
        success: true,
        message: 'No new news to analyze (skipped)',
        skipped: true,
      });
    }

    if (rawNews.length < 3) {
      return NextResponse.json({
        success: false,
        message: '데이터 부족 (최소 3개 이상의 뉴스가 필요합니다)',
      });
    }

    console.log(`📊 [Generate Briefing] Analyzing ${rawNews.length} new news items`);
    
    const globalIndices = await fetchGlobalIndices();
    const marketData = { globalIndices };

    // 분석 진행 상태를 Redis에 저장 (중간 결과 추적 및 타임아웃 복구용)
    progressKey = `briefing:progress:${Date.now()}`;
    await redis.set(progressKey, JSON.stringify({
      status: 'started',
      timestamp: new Date().toISOString(),
      newsCount: rawNews?.length || 0,
    }), 'EX', 3600); // 1시간 유지

    // 뉴스 데이터 압축 (비용 절감)
    const compactNews = compactNewsForPrompt(rawNews as Array<Record<string, unknown>>);

    const analysisResult = await performAIAnalysis({
      userKeywords: ANALYSIS_KEYWORDS,
      marketData,
      newsList: compactNews, // 압축된 뉴스 사용
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

    if (finishReason === 'length') {
      const userFriendlyMessage =
        'AI 분석 중 응답이 너무 길어져 생성이 중단되었습니다. 뉴스 데이터 양을 줄이거나 잠시 후 다시 시도해주세요.';
      return apiError(userFriendlyMessage, 413, 'PAYLOAD_TOO_LARGE', {
        originalError: errorMessage,
        suggestion: '데이터가 너무 많습니다. 최근 뉴스로 제한하거나 배치 크기를 줄여보세요.',
      });
    }

    return apiError(errorMessage, 500);
  }
});
