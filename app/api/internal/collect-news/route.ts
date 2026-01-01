import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchDailyNews } from '@/lib/news/fetchNews';

export async function GET(req: Request) {
  // 공통 보안 사항: Cron Secret 검증
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const articles = await fetchDailyNews();
    
    // 뉴스 제목(title)이나 URL을 기준으로 중복 저장 방지 (Upsert)
    const newsToUpsert = articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt,
      content: article.content
    }));

    const { error } = await supabase
      .from('raw_news')
      .upsert(newsToUpsert, { onConflict: 'url' });

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'News collected and upserted successfully',
      count: newsToUpsert.length 
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Collect News Error:', error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
