import { Metadata } from 'next';
import AnalysisClient from './AnalysisClient';
import { supabase } from '@/lib/supabase';


export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await supabase
      .from('briefing_history')
      .select('data')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!data) return { title: 'AI 심층 마켓 분석' };

    const analysis = data.data.main?.signal;
    const title = analysis?.focus || 'AI 심층 마켓 분석';
    const description =
      analysis?.description || '실시간 글로벌 뉴스 기반 AI 시장 분석 리포트';

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://ai-red-mu.vercel.app';
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}`;

    return {
      title: `${title} | 오늘의 시그널`,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {
      title: 'AI 심층 마켓 분석',
      description: '실시간 글로벌 뉴스 기반 AI 시장 분석 리포트',
    };
  }
}

export default function AnalysisPage() {
  return <AnalysisClient />;
}
