'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SignalHighlight from '@/components/main/SignalHighlight';
import GlobalMacro from '@/components/main/GlobalMacro';
import SectorStrategy from '@/components/main/SectorStrategy';
import NewsFeed from '@/components/main/NewsFeed';
import ObservationSection from '@/components/main/ObservationSection';
import InsightSection from '@/components/main/InsightSection';
import NoticeModal from '@/components/common/NoticeModal';

export default function Home() {
  const [showNotice, setShowNotice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem('ai_notice_dismissed');
  });

  const handleCloseNotice = () => {
    setShowNotice(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_notice_dismissed', 'true');
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-8 relative">
        <div className="mx-auto max-w-7xl space-y-10 pb-10">
          <div id="section-signal">
            <SignalHighlight />
          </div>

          <div id="section-macro">
            <GlobalMacro />
          </div>

          <div id="section-news" className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <NewsFeed />
            <div>
              <SectorStrategy />
            </div>
          </div>
          <div id="section-observation">
            <ObservationSection />
          </div>
        </div>
        <InsightSection />
      </main>
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
