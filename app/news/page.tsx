'use client';

import { useMemo, useRef, useState } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import NewsFilters from '@/components/main/NewsFilters';
import Tags from '@/components/common/Tags';
import NewsFeedSkeleton from '@/components/skeleton/NewsFeedSkeleton';
import VirtualizedList from '@/components/common/VirtualizedList';
import PullToRefresh from '@/components/common/PullToRefresh';
import { Newspaper, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useSuspenseInfiniteNewsList } from '@/hooks/useMain';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { getDummyNewsItems } from '@/lib/utils/dummyNews';
import { formatPublishedAt } from '@/lib/utils/times';
import type { NewsItem } from '@/types/main';
import SectionWrapper from '@/components/common/boundaries/SectionWrapper';

const EMPTY_TEXT = '해당 조건에 맞는 뉴스가 없습니다.';

function NewsListContent() {
  const [sort, setSort] = useState('latest');
  const [period, setPeriod] = useState('all');
  const [category, setCategory] = useState('all');
  const searchParams = useSearchParams();

  const dummyMode = searchParams.get('dummy') === 'true';
  const virtualizedParam = searchParams.get('virtualized');
  const isVirtualized = dummyMode
    ? virtualizedParam === 'true'
    : virtualizedParam !== 'false';
  const virtualizationLabel = isVirtualized ? '가상화된 리스트' : '전체 DOM 렌더';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteNewsList({
    sort,
    period,
    category,
  });

  const apiNews = data.pages.flatMap((page) => page.data);
  const dummyNews = useMemo(
    () => (dummyMode ? getDummyNewsItems() : []),
    [dummyMode]
  );
  const newsItems = dummyMode ? dummyNews : apiNews;
  const isNextPageLoading = dummyMode ? false : isFetchingNextPage;
  const hasMore = dummyMode ? false : hasNextPage;

  const newsListRef = useRef<HTMLDivElement>(null);
  const metrics = usePerformanceMetrics({
    active: dummyMode,
    targetRef: newsListRef,
    trigger: newsItems.length,
    label: virtualizationLabel,
  });

  const renderNewsCard = (item: NewsItem, index: number) => (
    <Link key={`${item.id}-${index}`} href={`/news/${item.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (index % 10) * 0.05 }}
        className="kakao-card group flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between cursor-pointer hover:shadow-lg transition-all border border-(--border)"
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full ${
                item.impact === 'High'
                  ? 'bg-rose-500'
                  : item.impact === 'Medium'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
            />
            <div className="flex items-center gap-1 text-[11px] font-bold text-(--text-muted)">
              <Clock size={12} />
              {formatPublishedAt(item.published_at)}
            </div>
            <span className="rounded-md bg-(--secondary-bg) px-1.5 py-0.5 text-[10px] font-black text-(--text-muted) uppercase ">
              {item.source}
            </span>
            <span className="rounded-md bg-(--background) px-1.5 py-0.5 text-[9px] font-black text-(--text-muted) ">
              IMPACT: {item.impact}
            </span>
          </div>

          <h4 className="text-lg font-bold text-(--text-title) group-hover:text-(--primary-strong) transition-colors line-clamp-2">
            {item.title}
          </h4>
          <p className="line-clamp-2 text-sm font-medium text-(--text-muted) mb-3">
            {item.summary}
          </p>
          <Tags tags={item.tags} size={8} />
        </div>
      </motion.article>
    </Link>
  );

  return (
    <>
      <NewsFilters
        sort={sort}
        setSort={setSort}
        period={period}
        setPeriod={setPeriod}
        category={category}
        setCategory={setCategory}
      />

      <div ref={newsListRef} className="pt-4">
        {newsItems.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-sm text-(--text-muted)">
            {EMPTY_TEXT}
          </div>
        ) : isVirtualized ? (
          <VirtualizedList
            mode="feed"
            data={newsItems}
            hasMore={hasMore}
            loadMore={hasMore ? fetchNextPage : undefined}
            loading={isNextPageLoading}
            emptyText={EMPTY_TEXT}
            renderItem={(item, index) => renderNewsCard(item, index)}
          />
        ) : (
          <div className="space-y-4">
            {newsItems.map((item, index) => renderNewsCard(item, index))}
            {!dummyMode && hasMore && (
              <div className="flex justify-center">
                <button
                  className="rounded-full border border-(--border) px-5 py-2 text-sm font-semibold text-(--text-title)"
                  onClick={() => fetchNextPage()}
                  disabled={isNextPageLoading}
                >
                  {isNextPageLoading ? '로딩 중...' : '더 불러오기'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {dummyMode && (
        <div className="fixed bottom-6 left-0 z-50 w-72 rounded-2xl border border-(--border) bg-(--secondary-bg)/95 p-4 text-xs shadow-xl backdrop-blur">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-(--text-muted)">
            가상화 성능 측정
          </p>
          <p className="text-[12px] text-(--text-title)">
            측정 대상: 뉴스 리스트 ({virtualizationLabel})
          </p>
          <p className="mt-2 text-[11px] text-(--text-muted)">
            초기 렌더링: {metrics ? `${metrics.elapsedMs.toFixed(1)}ms` : '측정 중...'}
          </p>
          <p className="text-[11px] text-(--text-muted)">
            DOM 노드 수: {metrics ? metrics.domNodes.toLocaleString() : '측정 중...'}
          </p>
        </div>
      )}
    </>
  );
}

export default function NewsListPage() {
  return (
    <PullToRefresh>
      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <SectionHeader
            icon={
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 shadow-lg shadow-rose-500/20">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
            }
            title="시장 실시간 뉴스"
            subtitle="AI가 분석한 시장 영향력 기준 뉴스 아카이브"
            className="px-0"
          />

          <SectionWrapper
            sectionName="뉴스 리스트"
            fallback={
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <NewsFeedSkeleton key={i} list={true} />
                ))}
              </div>
            }
          >
            <NewsListContent />
          </SectionWrapper>
        </div>
      </main>
    </PullToRefresh>
  );
}
