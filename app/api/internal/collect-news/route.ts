import { NextResponse } from 'next/server';
import { TranslateNewsItem } from '@/types/news';
import { redis } from '@/lib/redis/redis';
import { fetchDailyNews } from '@/lib/news/fetchNews';
import { mapToTranslateItems } from '@/lib/news/mapToTranslateItem';

function auth(req: Request) {
  return (
    req.headers.get('x-internal-secret') === process.env.INTERNAL_API_SECRET
  );
}

export async function POST(req: Request) {
  if (!auth(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const articles = await fetchDailyNews();
  const items: TranslateNewsItem[] = mapToTranslateItems(articles);

  await redis.set('news:raw', JSON.stringify(items));

  return NextResponse.json({ success: true, count: items.length });
}
