// 검색 전용 뉴스 API 라우트
import { NextResponse } from 'next/server';
import { fetchSearchNews } from '@/lib/fetchNews';
import { transformSearchKeyword } from '@/lib/keywordTransform';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('q');

    if (!keyword)
      return NextResponse.json(
        { error: '키워드가 필요합니다.' },
        { status: 400 }
      );

    // 2) 검색어 전처리: 한글이면 검색에 적합한 영문 쿼리로 변환
    const { queryEn } = await transformSearchKeyword(keyword);

    // 3) 변환된 영어 키워드로 해외 뉴스 검색
    const news = await fetchSearchNews(queryEn);

    const total = news.length;

    return NextResponse.json({
      keyword,
      effectiveKeyword: queryEn,
      total,
      articles: news,
      // 5) 결과 없으면 안내 메시지
      ...(total === 0
        ? { message: '해외 뉴스 기준으로 검색 결과가 없습니다' }
        : {}),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : '뉴스 검색 실패';
    console.error('❌ Search News Error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
