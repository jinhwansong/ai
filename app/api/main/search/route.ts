import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ news: [], observations: [] });
  }

  try {
    // 1. 뉴스 검색 (제목, 요약, 태그에서 검색)
    const { data: newsData, error: newsError } = await supabase
      .from('news_articles')
      .select('id, title, summary, tags, published_at, source, impact')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%,tags.cs.{${query}}`)
      .order('published_at', { ascending: false })
      .limit(20);

    if (newsError) throw newsError;

    // 2. 관찰 대상 검색 (이름, 심볼, 태그, 이유에서 검색)
    const { data: observationData, error: obsError } = await supabase
      .from('observation_items')
      .select('*')
      .or(`name.ilike.%${query}%,symbol.ilike.%${query}%,tags.cs.{${query}},reason.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (obsError) throw obsError;

    return NextResponse.json({
      news: newsData || [],
      observations: observationData || [],
    });
  } catch (error) {
    console.error('Search API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
