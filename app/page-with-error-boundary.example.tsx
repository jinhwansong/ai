// 이 파일은 예시입니다. 실제로는 app/page.tsx에 적용하세요.

import SignalHighlight from '@/components/main/SignalHighlight';
import GlobalMacro from '@/components/main/GlobalMacro';
import SectorStrategy from '@/components/main/SectorStrategy';
import NewsFeed from '@/components/main/NewsFeed';
import ObservationSection from '@/components/main/ObservationSection';
import InsightSection from '@/components/main/InsightSection';
import NoticeModal from '@/components/common/NoticeModal';
import PullToRefresh from '@/components/common/PullToRefresh';
import { SectionErrorBoundary } from '@/components/common/SectionErrorBoundary';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <PullToRefresh>
        <main className="flex-1 px-4 py-8 md:px-8 md:pb-8 relative">
          <div className="mx-auto max-w-7xl space-y-10">
            {/* 시그널 하이라이트 - 에러 발생 시 이 섹션만 에러 표시 */}
            <div id="section-signal">
              <SectionErrorBoundary sectionName="시그널 하이라이트">
                <SignalHighlight />
              </SectionErrorBoundary>
            </div>

            {/* 글로벌 시장 - 독립적으로 작동 */}
            <div id="section-macro">
              <SectionErrorBoundary sectionName="글로벌 시장">
                <GlobalMacro />
              </SectionErrorBoundary>
            </div>

            {/* 뉴스 & 섹터 - 각각 독립적으로 에러 처리 */}
            <div
              id="section-news"
              className="grid gap-8 lg:grid-cols-[2fr_1fr]"
            >
              <SectionErrorBoundary sectionName="뉴스 피드">
                <NewsFeed />
              </SectionErrorBoundary>
              
              <SectionErrorBoundary sectionName="섹터 전략">
                <SectorStrategy />
              </SectionErrorBoundary>
            </div>

            {/* 관찰 포인트 */}
            <div id="section-observation">
              <SectionErrorBoundary sectionName="관찰 포인트">
                <ObservationSection />
              </SectionErrorBoundary>
            </div>
          </div>
        </main>
      </PullToRefresh>

      {/* 인사이트 섹션 */}
      <SectionErrorBoundary sectionName="인사이트">
        <InsightSection />
      </SectionErrorBoundary>

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
