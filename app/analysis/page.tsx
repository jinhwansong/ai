import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import AnalysisClient from './AnalysisClient';

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
    const description = analysis?.description || '실시간 글로벌 뉴스 기반 AI 시장 분석 리포트';

    return {
      title: `${title} | 오늘의 시그널`,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        // 배포 후 실제 도메인 이미지 경로를 넣으면 카톡에 사진도 나옵니다.
        // images: [{ url: 'https://your-domain.com/og-image.png' }], 
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
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
