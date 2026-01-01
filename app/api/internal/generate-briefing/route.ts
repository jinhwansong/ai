import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/redis/redis';
import { performAIAnalysis } from '@/lib/services/briefing';

export async function GET(req: Request) {
  // 공통 보안 사항: Cron Secret 검증
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. raw_news 테이블에서 최신 뉴스 가져오기
    const { data: rawNews, error: newsError } = await supabase
      .from('raw_news')
      .select('*')
      .order('publishedAt', { ascending: false })
      .limit(10);

    if (newsError) throw newsError;

    // 2. 예외 처리: 뉴스가 3개 미만이면 "데이터 부족" 응답 후 종료
    if (!rawNews || rawNews.length < 3) {
      return NextResponse.json({
        success: false,
        message: '데이터 부족 (최소 3개 이상의 뉴스가 필요합니다)',
      });
    }

    // 3. 공통 서비스를 통한 AI 분석 수행
    const defaultKeywords = ['경제', '산업', '주식'];
    const marketData = {}; // TODO: 실시간 시장 데이터 연동 필요 시 보완
    const userPortfolio = {};

    const analysisResult = await performAIAnalysis({
      modelType: 'gemini',
      userKeywords: defaultKeywords,
      marketData,
      newsList: rawNews,
      userPortfolio,
    });

    const finalData = {
      ...analysisResult,
      createdAt: new Date().toISOString(),
    };

    // 4. Redis 저장 (dashboard:latest) - 메인 대시보드용 핵심 데이터
    await redis.set('dashboard:latest', JSON.stringify(finalData.main));

    // 5. Supabase 저장 (briefing_history) - 상세 리포트 및 이력 저장용
    const { error: saveError } = await supabase.from('briefing_history').insert({
      data: finalData,
      created_at: new Date().toISOString(),
    });

    if (saveError) throw saveError;

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
}
