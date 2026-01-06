'use client';

import {
  useMainSignal,
  useMainSector,
  useMainMacro,
  useMainNews,
} from '@/hooks/useMain';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SignalHighlight from '@/components/main/SignalHighlight';
import GlobalMacro from '@/components/main/GlobalMacro';
import SectorStrategy from '@/components/main/SectorStrategy';
import NewsFeed from '@/components/main/NewsFeed';
import { GlobalMacroItem, MainSignal } from '@/types/main';
import SignalHighlightSkeleton from '@/components/main/SignalHighlightSkeleton';
import GlobalMacroSkeleton from '@/components/main/GlobalMacroSkeleton';
import SectorStrategySkeleton from '@/components/main/SectorStrategySkeleton';
import NewsFeedSkeleton from '@/components/main/NewsFeedSkeleton';
import InsightSection from '@/components/main/InsightSection';

export default function Home() {
  const { data: signal, isLoading: isSignalLoading } = useMainSignal();
  const { data: sectorData, isLoading: isSectorLoading } = useMainSector();
  const { data: macroData, isLoading: isMacroLoading } = useMainMacro();

  const { data: newsData, isLoading: isNewsLoading } = useMainNews();

  if(isSignalLoading) return <SignalHighlightSkeleton />;
  if(isMacroLoading) return <GlobalMacroSkeleton />;
  if(isSectorLoading) return <SectorStrategySkeleton />;
  if(isNewsLoading) return <NewsFeedSkeleton />;
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-8 relative">
        <div className="mx-auto max-w-7xl space-y-8 pb-32">
          <SignalHighlight {...(signal as MainSignal)} />

          <GlobalMacro data={macroData as unknown as GlobalMacroItem[]} />

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <NewsFeed news={newsData?.news || []} />
            <SectorStrategy
              items={sectorData?.items || []}
              date={sectorData?.date || ''}
            />
          </div>
        </div>

        {/* Sticky Insight Section at the bottom of main */}
        <InsightSection />
      </main>
      <Footer />
    </div>
  );
}
