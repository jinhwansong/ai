import SignalHighlight from '@/components/home/SignalHighlight';
import GlobalMacro from '@/components/home/GlobalMacro';
import SectorStrategy from '@/components/home/SectorStrategy';
import NewsFeed from '@/components/home/NewsFeed';
import ObservationSection from '@/components/home/ObservationSection';
import InsightSection from '@/components/home/InsightSection';
import NoticeModal from '@/components/ui/NoticeModal';
import SectionWrapper from '@/components/boundaries/SectionWrapper';
import SignalHighlightSkeleton from '@/components/loading/SignalHighlightSkeleton';
import GlobalMacroSkeleton from '@/components/loading/GlobalMacroSkeleton';
import SectorStrategySkeleton from '@/components/loading/SectorStrategySkeleton';
import NewsFeedSkeleton from '@/components/loading/NewsFeedSkeleton';
import ObservationSkeleton from '@/components/loading/ObservationSkeleton';
import InsightSectionSkeleton from '@/components/loading/InsightSectionSkeleton';

export default function Home() {

  return (
    <div className="flex min-h-screen flex-col">
      
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
          <li>
            집계 파이프라인은 KST 기준 하루 6회(약 4시간 간격) 실행됩니다. 자세한 시각은
            저장소의 GitHub Actions 스케줄을 참고하세요.
          </li>
        </ul>
      </NoticeModal>
    </div>
  );
}
