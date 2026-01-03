'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import {
  useMainSignal,
  useMainSector,
  useMainMacro,
  useMainPortfolio,
  useMainNews,
} from '@/hooks/useMain';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SignalHighlight from '@/components/main/SignalHighlight';
import GlobalMacro from '@/components/main/GlobalMacro';
import SectorStrategy from '@/components/main/SectorStrategy';
import NewsFeed from '@/components/main/NewsFeed';
import Portfolio from '@/components/main/Portfolio';
import Spinner from '@/components/common/Spinner';
import { GlobalMacroItem, MainSignal, PortfolioData } from '@/types/main';
import SignalHighlightSkeleton from '@/components/main/SignalHighlightSkeleton';
import GlobalMacroSkeleton from '@/components/main/GlobalMacroSkeleton';
import SectorStrategySkeleton from '@/components/main/SectorStrategySkeleton';
import NewsFeedSkeleton from '@/components/main/NewsFeedSkeleton';
import PortfolioSkeleton from '@/components/main/PortfolioSkeleton';

export default function Home() {
  const router = useRouter();
  const { completed, hasHydrated, keywords } = useOnboardingStore((state) => state);
  const { data: signal, isLoading: isSignalLoading } = useMainSignal();
  const { data: sectorData, isLoading: isSectorLoading } = useMainSector();
  const { data: macroData, isLoading: isMacroLoading } = useMainMacro();
  const { data: portfolioData, isLoading: isPortfolioLoading } =
    useMainPortfolio();
  const { data: newsData, isLoading: isNewsLoading } = useMainNews();

  useEffect(() => {
    if (hasHydrated && !completed) {
      router.replace('/onboarding');
    }
  }, [hasHydrated, completed, router]);
  // 개인화 분석 로직 고도화
  const personalizedSectors = sectorData?.items ? [...sectorData.items]
    .sort((a, b) => {
      const aMatch = keywords.includes(a.name);
      const bMatch = keywords.includes(b.name);
      
      // 1순위: 유저가 온보딩에서 선택한 키워드 우선
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      
      // 2순위: 키워드 일치 여부가 같다면, 투자 신호(stance)가 좋은 순서대로 정렬
      const stanceScore: Record<string, number> = {
        POSITIVE: 3,
        WATCHING: 2,
        NEUTRAL: 1,
        NEGATIVE: 0,
      };
      
      const scoreA = stanceScore[a.stance] ?? 0;
      const scoreB = stanceScore[b.stance] ?? 0;
      
      return scoreB - scoreA;
    })
    .slice(0, 4) // 개인화된 순서대로 상위 4개만 노출
    : [];

  const personalizedNews = newsData?.news ? [...newsData.news].sort((a, b) => {
    const aMatch = a.tags.some(tag => keywords.includes(tag));
    const bMatch = b.tags.some(tag => keywords.includes(tag));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  }) : [];

  if (!hasHydrated || !completed) return <Spinner />;
  if(isSignalLoading) return <SignalHighlightSkeleton />;
  if(isMacroLoading) return <GlobalMacroSkeleton />;
  if(isSectorLoading) return <SectorStrategySkeleton />;
  if(isNewsLoading) return <NewsFeedSkeleton />;
  if(isPortfolioLoading) return <PortfolioSkeleton />;
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl space-y-8 pb-20">
          <SignalHighlight {...(signal as MainSignal)} />

          <GlobalMacro data={macroData as unknown as GlobalMacroItem[]} />

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-8">
              <SectorStrategy
                items={personalizedSectors}
                date={sectorData?.date || ''}
              />

              {portfolioData && (
                <Portfolio
                  performance={
                    (portfolioData as unknown as PortfolioData).performance
                  }
                  holdings={(portfolioData as unknown as PortfolioData).holdings}
                />
              )}
            </div>

            <div className="space-y-8">
              <NewsFeed news={personalizedNews} />

              {/* Insight Card */}
              {portfolioData && (
                <div className="kakao-card bg-linear-to-br from-slate-800 to-slate-900 p-6 text-white">
                  <h4 className="text-sm font-black uppercase tracking-widest opacity-60">
                    Insight Card
                  </h4>
                  <p className="mt-4 text-lg font-bold">
                    &quot;
                    {(portfolioData as unknown as PortfolioData)
                      .strategicSummary ||
                      '시장 상황을 기반으로 한 AI 분석 결과를 도출 중입니다.'}
                    &quot;
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-1 w-12 rounded-full bg-indigo-500"></div>
                    <span className="text-[10px] font-black uppercase opacity-60">
                      AI Interpretation
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
