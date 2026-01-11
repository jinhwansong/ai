'use client';

import { useState, useSyncExternalStore } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SignalHighlight from '@/components/main/SignalHighlight';
import GlobalMacro from '@/components/main/GlobalMacro';
import SectorStrategy from '@/components/main/SectorStrategy';
import NewsFeed from '@/components/main/NewsFeed';
import ObservationSection from '@/components/main/ObservationSection';
import InsightSection from '@/components/main/InsightSection';
import NoticeModal from '@/components/common/NoticeModal';
import PullToRefresh from '@/components/common/PullToRefresh';

export default function Home() {
  const queryClient = useQueryClient();
  const [isClosedManually, setIsClosedManually] = useState(false);

  const isDismissed = useSyncExternalStore(
    () => () => {}, 
    () => localStorage.getItem('ai_notice_dismissed') === 'true',
    () => true 
  );

  const showNotice = !isDismissed && !isClosedManually;

  const handleCloseNotice = () => {
    setIsClosedManually(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_notice_dismissed', 'true');
    }
  };

  const handleRefresh = async () => {
    // PTR에서는 "백그라운드 refetch"가 아니라, 스켈레톤이 다시 보이도록
    // 쿼리 상태를 초기화(reset) 후 재요청하는 UX로 처리
    await queryClient.resetQueries({ type: 'active' });
    // 애니메이션 시인성을 위한 최소 대기 시간
    await new Promise(resolve => setTimeout(resolve, 800));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <PullToRefresh onRefresh={handleRefresh}>
        <main className="flex-1 px-4 py-8 md:px-8 md:pb-8 relative">
          <div className="mx-auto max-w-7xl space-y-10">
            <div id="section-signal">
              <SignalHighlight />
            </div>

            <div id="section-macro">
              <GlobalMacro />
            </div>

            <div
              id="section-news"
              className="grid gap-8 lg:grid-cols-[2fr_1fr]"
            >
              <NewsFeed />
              <SectorStrategy />
            </div>
            <div id="section-observation">
              <ObservationSection />
            </div>
          </div>
        </main>
      </PullToRefresh>

      <InsightSection />
      <Footer />

      <NoticeModal open={showNotice} onClose={handleCloseNotice}>
        <ul className="list-disc space-y-2 pl-5">
          <li>AI는 시장 판단을 대신하지 않습니다.</li>
          <li>지수·뉴스는 사실 기반, 코멘트는 AI 요약입니다.</li>
          <li>투자 결정 전 반드시 원문·데이터를 확인하세요.</li>
          <li>매일 9시, 12시, 18시에 데이터가 업데이트됩니다.</li>
        </ul>
      </NoticeModal>
    </div>
  );
}
