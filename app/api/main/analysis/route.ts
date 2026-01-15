import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. 가장 최신 브리핑 기록 가져오기
    const { data, error } = await supabase
      .from('briefing_history')
      .select('data, created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Failed to fetch briefing history:', error);
      return NextResponse.json({ error: '데이터를 불러오는데 실패했습니다.' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: '브리핑 내역이 없습니다.' }, { status: 404 });
    }

    const briefingData = data.data;
    const main = briefingData.main;

    // 기존 데이터 재가공
    const signal = main.signal || {};
    const newsHighlights = main.newsHighlights || [];
    const sectorSummary = main.sectorSummary || [];

    // 체크포인트: 뉴스 상위 3개의 요약 사용
    const checkPoints = newsHighlights
      .slice(0, 3)
      .map((news: { descriptionShort: string }) => news.descriptionShort);

    // 관련 섹터: 섹터 상위 4개 매핑
    const relatedSectors = sectorSummary
      .slice(0, 4)
      .map((sector: { name: string; signal: string; momentum: string }) => ({
        name: sector.name,
        status: mapSignalToStatus(sector.signal),
        trend: sector.momentum as 'Strong' | 'Moderate' | 'Building',
      }));

    // 관련 뉴스: Supabase news_articles에서 최신 3개 가져오기 (source, url 포함)
    const { data: newsArticles } = await supabase
      .from('news_articles')
      .select('title, source, url, published_at')
      .order('published_at', { ascending: false })
      .limit(3);

    const relatedNews = (newsArticles || []).map((news: { title: string; source: string; url: string; published_at: string }) => ({
      title: news.title,
      source: news.source || 'AI분석',
      url: news.url || null,
      time: getRelativeTimeFromDate(news.published_at),
    }));

    // 상세 분석 데이터 반환
    return NextResponse.json({
      title: signal.focus || '시장 분석 리포트',
      content: signal.description || '분석 내용을 생성 중입니다.',
      tags: signal.tags || [],
      sentimentScore: parseInt(signal.value) || 50,
      checkPoints,
      relatedSectors,
      relatedNews,
      publishedAt: data.created_at,
    });
  } catch (error) {
    console.error('Analysis API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// 섹터 signal을 status로 매핑
function mapSignalToStatus(signal: string): '강세' | '약세' | '중립' {
  if (signal === 'POSITIVE') return '강세';
  if (signal === 'NEGATIVE') return '약세';
  return '중립';
}

// 상대 시간 생성
function getRelativeTimeFromDate(dateString: string): string {
  const now = new Date();
  const published = new Date(dateString);
  const diffMs = now.getTime() - published.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return '방금 전';
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays === 1) return '어제';
  if (diffDays < 7) return `${diffDays}일 전`;
  return '최근';
}
