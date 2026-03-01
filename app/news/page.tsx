'use client';

import React, { useCallback } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import NewsFilters from '@/components/main/NewsFilters';
import Tags from '@/components/common/Tags';
import NewsFeedSkeleton from '@/components/skeleton/NewsFeedSkeleton';
import VirtualizedList from '@/components/common/VirtualizedList';
import PullToRefresh from '@/components/common/PullToRefresh';
import { Newspaper, Clock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSuspenseInfiniteNewsList } from '@/hooks/query';
import { formatPublishedAt } from '@/lib/utils/times';
import type { NewsItem } from '@/types/main';
import SectionWrapper from '@/components/common/boundaries/SectionWrapper';

const EMPTY_TEXT = '해당 조건에 맞는 뉴스가 없습니다.';

export default function NewsListPage() {
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

  const computeItemKey = useCallback((_: number, item: NewsItem) => item.id, []);

  const renderItem = useCallback((item: NewsItem, _: number) => {
    return (
      <Link href={`/news/${item.id}`} className="block">
        <article className="kakao-card group flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between cursor-pointer hover:shadow-lg transition-all border border-(--border)">
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
        </article>
      </Link>
    );
  }, []);

  const loadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

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
                  computeItemKey={computeItemKey}
                  hasMore={hasNextPage}
                  loadMore={hasNextPage ? loadMore : undefined}
                  loading={isFetchingNextPage}
                  emptyText={EMPTY_TEXT}
                  renderItem={renderItem}
                />
              )}
            </div>
          </SectionWrapper>
        </div>
      </main>
    </PullToRefresh>
  );
}
