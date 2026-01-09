import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      summary: data.summary, // 한 줄 요약
      content: data.content, // 심층 분석 본문
      tags: data.tags,
      published_at: data.published_at,
      source: data.source,
      impact: data.impact,
      url: data.url,
      checkpoints: data.checkpoints, // 오늘의 관전 포인트
      related_sectors: data.related_sectors, // 관련 섹터
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
