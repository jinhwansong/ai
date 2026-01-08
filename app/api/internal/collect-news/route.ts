import {  NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchSearchNews } from '@/lib/news/fetchNews';
import { verifyCronAuth } from '@/util/verifyCronAuth';

const NEWS_CATEGORIES = [
  { name: '국내증시', query: 'Korea stock market KOSPI KOSDAQ' },
  { name: '미국증시', query: 'US stock market Nasdaq S&P500' },
  {
    name: '금리/채권',
    query: 'interest rates Fed treasury bonds monetary policy',
  },
  { name: '환율', query: 'forex USD KRW exchange rate currency volatility' },
  { name: '반도체/AI', query: 'semiconductor HBM4 NVIDIA TSMC AI-chip' }, // HBM4 추가
  {
    name: '로보틱스/물리AI',
    query: 'Physical AI Robotics Humanoid Tesla Optimus CES 2026',
  }, // 2026 핵심 키워드 추가
  {
    name: '전력/에너지',
    query: 'SMR nuclear power grid electricity AI data center',
  }, // 데이터센터 전력난 관련 추가
  { name: '이차전지', query: 'EV battery lithium-ion Tesla IRA policy' },
  {
    name: '바이오/헬스',
    query: 'biotech GLP-1 pharmaceutical healthcare digital-health',
  }, // 비만치료제(GLP-1) 트렌드 반영
  { name: '빅테크', query: 'Big Tech Apple Microsoft Google Meta AI-agent' }, // AI 에이전트 추가
  { name: '부동산', query: 'real estate housing market mortgage REITS' },
  { name: '원자재', query: 'commodities oil gold copper lithium' },
  { name: '가상자산', query: 'crypto Bitcoin Ethereum ETF' },
  {
    name: '무역/관세',
    query: 'Trump tariff trade war supply chain protectionism',
  }, // 트럼프 2기 관세 이슈 추가
];

export const GET = verifyCronAuth(async () => {
  try {
    const allArticles = [];

    // 키워드별로 뉴스 수집 (영어 쿼리로 검색하여 데이터 확보)
    for (const item of NEWS_CATEGORIES) {
      try {
        console.log(`Collecting news for: ${item.name}...`);
        const articles = await fetchSearchNews(item.query);
        
        // 각 기사에 수집된 키워드 태그 추가
        const taggedArticles = articles.map(a => ({
          ...a,
          collected_tag: item.name
        }));
        
        allArticles.push(...taggedArticles);
      } catch (err) {
        console.error(`Error collecting news for ${item.name}:`, err);
      }
    }

    if (allArticles.length === 0) {
      return NextResponse.json({ success: true, message: 'No news found' });
    }

    // 뉴스 제목(title)이나 URL을 기준으로 중복 저장 방지 (Upsert)
    const newsToUpsert = allArticles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image_url: article.urlToImage,
      source: article.source?.name || null,
      published_at: article.published_at,
      content: article.content,
    }));

    // URL 중복 제거 (여러 키워드에 중복으로 걸릴 수 있음)
    const uniqueNews = Array.from(new Map(newsToUpsert.map(item => [item.url, item])).values());

    const { error } = await supabase
      .from('raw_news')
      .upsert(uniqueNews, { onConflict: 'url' });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'News collected and upserted successfully',
      count: uniqueNews.length,
      categories_processed: NEWS_CATEGORIES.length
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Collect News Error:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
});
