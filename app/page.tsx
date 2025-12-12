'use client';
import Link from 'next/link';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import DailyBriefingSection from '@/components/main/DailyBriefingSection';
import SearchBar from '@/components/main/SearchBar';

export default function Home() {
  const { keywords, hasHydrated } = useOnboardingStore();
  const keywordList = keywords ?? [];

  return (
    <div className="px-5 py-8">
      {/* 1. Hero + 검색 */}
      <section className="pt-2 pb-8">
        <div className="space-y-3">
          <p className="text-sm text-(--text-muted)">
            글로벌 경제 뉴스를 빠르게 요약하고, 한국 시장 관점으로 정리합니다.
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-(--text-title)">
            오늘의 핵심 이슈를
            <br />
            한 번에 파악하세요
          </h1>
          <p className="text-(--text-body)">
            키워드를 검색하거나, 오늘 브리핑과 관심 키워드 브리핑을 확인해 보세요.
          </p>
        </div>

        <div className="mt-6">
          <SearchBar />
        </div>
      </section>

      {/* 2. 오늘의 브리핑 */}
      <section id="today" className="scroll-mt-20 py-10 border-t border-(--border)">
        <DailyBriefingSection />
      </section>

      {/* 3. 키워드 브리핑 */}
      <section
        id="keywords"
        className="scroll-mt-20 py-10 border-t border-(--border)"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-(--text-title)">
              키워드 브리핑
            </h2>
            <p className="text-sm text-(--text-muted) mt-1">
              내가 선택한 키워드를 기준으로 관련 뉴스를 모아 요약합니다.
            </p>
          </div>

          <Link
            href="/onboarding"
            className="text-sm font-medium text-(--primary) hover:underline"
          >
            키워드 설정
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {!hasHydrated && (
            <>
              <span className="px-3 py-1 rounded-full text-sm bg-(--keyword-bg) text-(--text-muted)">
                로딩 중…
              </span>
            </>
          )}

          {hasHydrated && keywordList.length === 0 && (
            <div className="w-full p-5 rounded-xl border border-(--border) bg-(--card-bg)">
              <p className="text-(--text-body)">
                아직 선택한 키워드가 없어요. 키워드를 설정하면 맞춤 브리핑이
                생성됩니다.
              </p>
              <Link
                href="/onboarding"
                className="inline-block mt-3 text-sm font-medium text-(--primary) hover:underline"
              >
                키워드 선택하러 가기
              </Link>
            </div>
          )}

          {hasHydrated &&
            keywordList.length > 0 &&
            keywordList.map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="px-3 py-1 rounded-full text-sm bg-(--keyword-bg) text-(--foreground) hover:bg-(--hover-strong)"
              >
                {kw}
              </Link>
            ))}
        </div>
      </section>

      {/* 4. 보조 설명 섹션 */}
      <section className="py-10 border-t border-(--border)">
        <h2 className="text-xl font-semibold text-(--text-title)">
          이렇게 활용해 보세요
        </h2>
        <div className="mt-4 grid gap-3">
          <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
            <p className="text-(--text-body)">
              - 오늘의 브리핑으로 <b>시장 주요 이슈</b>를 빠르게 훑고,
              <br />- 관심 키워드로 <b>내 포트폴리오 관련 이슈</b>만 추적하세요.
            </p>
          </div>
          <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
            <p className="text-(--text-body)">
              검색 결과는 기사 목록과 함께, AI가 정리한 <b>핵심 인사이트</b>를
              제공합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="py-10 border-t border-(--border)">
        <div className="text-sm text-(--text-muted) space-y-1">
          <p>AI 경제 리포트</p>
          <p>데이터/요약은 참고용이며 투자 판단의 책임은 사용자에게 있습니다.</p>
        </div>
      </footer>
    </div>
  );
}
