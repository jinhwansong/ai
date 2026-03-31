'use client';

import React, { Suspense, useCallback } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import NewsFilters from '@/components/news/NewsFilters';
import NewsCard from '@/components/news/NewsCard';
import NewsFeedSkeleton from '@/components/loading/NewsFeedSkeleton';
import NewsFiltersSkeleton from '@/components/loading/NewsFiltersSkeleton';
import VirtualizedList from '@/components/ui/VirtualizedList';
import { Newspaper } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSuspenseInfiniteNewsList } from '@/hooks/query';
import SectionWrapper from '@/components/boundaries/SectionWrapper';

const EMPTY_TEXT = '해당 조건에 맞는 뉴스가 없습니다.';

function NewsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get('sort') ?? 'latest';
  const period = searchParams.get('period') ?? 'all';
  const category = searchParams.get('category') ?? 'all';

  const setSort = useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('sort', val);
      router.replace(`/news?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );
  const setPeriod = useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('period', val);
      router.replace(`/news?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );
  const setCategory = useCallback(
    (val: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('category', val);
      router.replace(`/news?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

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

  const newsItems = data.flatItems;

  const loadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return (
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

          <SectionWrapper sectionName="뉴스 리스트">
            <NewsFilters
              sort={sort}
              setSort={setSort}
              period={period}
              setPeriod={setPeriod}
              category={category}
              setCategory={setCategory}
            />

            <div className="pt-4">
              {newsItems.length === 0 ? (
                <div className="flex h-48 items-center justify-center text-sm text-(--text-muted)">
                  {EMPTY_TEXT}
                </div>
              ) : (
                <VirtualizedList
                  mode="feed"
                  data={newsItems}
                  computeItemKey={(_, item) => item.id}
                  hasMore={hasNextPage}
                  loadMore={hasNextPage ? loadMore : undefined}
                  loading={isFetchingNextPage}
                  emptyText={EMPTY_TEXT}
                  renderItem={(item) => <NewsCard item={item} />}
                />
              )}
            </div>
          </SectionWrapper>
        </div>
      </main>
  );
}

export default function NewsListPage() {
  return (
    <Suspense
      fallback={
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
            <NewsFiltersSkeleton />
            <div className="pt-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <NewsFeedSkeleton key={i} list={true} />
              ))}
            </div>
          </div>
        </main>
      }
    >
      <NewsListContent />
    </Suspense>
  );
}
