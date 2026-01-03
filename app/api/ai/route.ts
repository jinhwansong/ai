import { NextRequest, NextResponse } from 'next/server';
import { performAIAnalysis, BriefingInquiry } from '@/lib/services/briefing';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body: BriefingInquiry = await req.json();

    // 1. 비어있다면, 백엔드 DB에서 최신 뉴스를 직접 가져옴
    if (!body.newsList || body.newsList.length === 0) {
      const { data: latestNews } = await supabase
        .from('raw_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(10);

      body.newsList = latestNews || [];
    }

    // 2. marketData가 없다면 기본값 세팅 (나중에 마켓 API 연동 가능)
    if (!body.marketData) {
      body.marketData = {};
    }

    // 공통 서비스 호출을 통한 분석 수행
    const result = await performAIAnalysis(body);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error('On-demand AI Analysis Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
