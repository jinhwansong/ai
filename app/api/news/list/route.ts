import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { subDays, subMonths, startOfDay } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const sort = searchParams.get('sort') || 'latest';
  const category = searchParams.get('category') || 'all';
  const period = searchParams.get('period') || 'all'; 
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const offset = (page - 1) * limit;

  try {
    let query = supabase.from('news_articles').select('*', { count: 'exact' });

    // 1. 기간 필터 (Period)
    const now = new Date();
    if (period === 'today') {
      query = query.gte('published_at', startOfDay(now).toISOString());
    } else if (period === 'week') {
      query = query.gte('published_at', subDays(now, 7).toISOString());
    } else if (period === 'month') {
      query = query.gte('published_at', subMonths(now, 1).toISOString());
    }

    // 2. 카테고리 필터 (Category)
    if (category !== 'all') {
      // news_articles 테이블은 summary 컬럼을 사용합니다.
      query = query.or(`title.ilike.%${category}%,summary.ilike.%${category}%`);
    }

    // 3. 정렬 (Sort)
    if (sort === 'oldest') {
      query = query.order('published_at', { ascending: true });
    } else if (sort === 'importance') {
      // impact 순서대로 정렬 (High -> Medium -> Low)
      query = query
        .order('impact', { ascending: false }) // H, M, L 순서가 되도록 유도 (필요시 DB 로직 보완)
        .order('published_at', { ascending: false });
    } else {
      query = query.order('published_at', { ascending: false });
    }

    // 4. 페이지네이션 (Pagination)
    const { data, error, count } = await query.range(
      offset,
      offset + limit - 1
    );

    if (error) throw error;

    // 리스트용 데이터 가공 
    const processedData = (data || []).map((item: Record<string, unknown>) => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      tags: item.tags,
      published_at: item.published_at,
      source: item.source,
      impact: item.impact,
    }));

    return NextResponse.json({
      success: true,
      data: processedData,
      pagination: {
        page,
        limit,
        total: count,
        hasNext: count ? offset + limit < count : false,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
