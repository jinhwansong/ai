import SignalHighlight from '@/components/main/SignalHighlight';
import GlobalMacro from '@/components/main/GlobalMacro';
import SectorStrategy from '@/components/main/SectorStrategy';
import NewsFeed from '@/components/main/NewsFeed';
import ObservationSection from '@/components/main/ObservationSection';
import InsightSection from '@/components/main/InsightSection';
import NoticeModal from '@/components/common/NoticeModal';
import PullToRefresh from '@/components/common/PullToRefresh';
import SectionWrapper from '@/components/common/boundaries/SectionWrapper';
import SignalHighlightSkeleton from '@/components/skeleton/SignalHighlightSkeleton';
import GlobalMacroSkeleton from '@/components/skeleton/GlobalMacroSkeleton';
import SectorStrategySkeleton from '@/components/skeleton/SectorStrategySkeleton';
import NewsFeedSkeleton from '@/components/skeleton/NewsFeedSkeleton';
import ObservationSkeleton from '@/components/skeleton/ObservationSkeleton';
import InsightSectionSkeleton from '@/components/skeleton/InsightSectionSkeleton';

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col">
      
      <PullToRefresh>
        <main className="flex-1 px-4 py-8 md:px-8 md:pb-8 relative">
          <div className="mx-auto max-w-7xl space-y-10">
            <div id="section-signal">
              <SectionWrapper
                sectionName="시그널 하이라이트"
                fallback={<SignalHighlightSkeleton />}
              >
                <SignalHighlight />
              </SectionWrapper>
            </div>

            <div id="section-macro">
              <SectionWrapper
                sectionName="글로벌 시장 요약"
                fallback={<GlobalMacroSkeleton />}
              >
                <GlobalMacro />
              </SectionWrapper>
            </div>

            <div
              id="section-news"
              className="grid gap-8 lg:grid-cols-[2fr_1fr]"
            >
              <SectionWrapper
                sectionName="오늘의 핵심 뉴스"
                fallback={<NewsFeedSkeleton />}
              >
                <NewsFeed />
              </SectionWrapper>
              <SectionWrapper
                sectionName="오늘의 섹터 전략"
                fallback={<SectorStrategySkeleton />}
              >
                <SectorStrategy />
              </SectionWrapper>
            </div>
            <div id="section-observation">
              <SectionWrapper
                sectionName="관찰 포인트"
                fallback={<ObservationSkeleton />}
              >
                <ObservationSection />
              </SectionWrapper>
            </div>
          </div>
        </main>
      </PullToRefresh>

      <SectionWrapper
        sectionName="시장 인사이트"
        fallback={<InsightSectionSkeleton />}
      >
        <InsightSection />
      </SectionWrapper>
    
      <NoticeModal>
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
