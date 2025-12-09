// 검색 전용 뉴스 API 라우트
import { NextResponse } from 'next/server';
import { fetchSearchNews } from '@/lib/fetchNews';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q');

    if (!keyword)
      return NextResponse.json(
        { error: '키워드가 필요합니다.' },
        { status: 400 }
      );

    const news = await fetchSearchNews(keyword);

    return NextResponse.json({
      keyword,
      total: news.length,
      articles: news,
    });
  } catch (err) {
    console.error('❌ Search News Error:', err);
    return NextResponse.json({ error: '뉴스 검색 실패' }, { status: 500 });
  }
}
