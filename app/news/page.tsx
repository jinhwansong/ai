'use client';

import { useState, useSyncExternalStore } from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SectionHeader from '@/components/common/SectionHeader';
import { Newspaper, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInfiniteNewsList } from '@/hooks/useMain';
import NewsFilters from '@/components/main/NewsFilters';
import Tags from '@/components/common/Tags';
import NewsFeedSkeleton from '@/components/skeleton/NewsFeedSkeleton';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import VirtualizedList from '@/components/common/VirtualizedList';
import PullToRefresh from '@/components/common/PullToRefresh';
import { useQueryClient } from '@tanstack/react-query';

export default function NewsListPage() {
  const [sort, setSort] = useState('latest');
  const [period, setPeriod] = useState('all');
  const [category, setCategory] = useState('all');
  const queryClient = useQueryClient();
  
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteNewsList({ sort, period, category });

  const allNews = data?.pages.flatMap((page) => page.data) || [];

  const handleRefresh = async () => {
    // 뉴스 리스트만 새로고침 (페이지/필터 포함한 infinite query 갱신)
    await queryClient.invalidateQueries({ queryKey: ['news-list'] });
    // 애니메이션 시인성을 위한 최소 대기 시간
    await new Promise((resolve) => setTimeout(resolve, 600));
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--background)">
      <Header />

      <PullToRefresh onRefresh={handleRefresh}>
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

            {/* 필터 섹션 */}
            <NewsFilters
              sort={sort}
              setSort={setSort}
              period={period}
              setPeriod={setPeriod}
              category={category}
              setCategory={setCategory}
            />

            {/* 뉴스 리스트 (Virtualized) */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <NewsFeedSkeleton key={i} list={true} />
                ))}
              </div>
            ) : (
              <div className="pt-4">
                <VirtualizedList
                  mode="feed"
                  data={allNews}
                  hasMore={hasNextPage}
                  loadMore={fetchNextPage}
                  loading={isFetchingNextPage}
                  emptyText="해당 조건에 맞는 뉴스가 없습니다."
                  renderItem={(item, index) => (
                    <Link key={`${item?.id}-${index}`} href={`/news/${item?.id}`}>
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
                                item?.impact === 'High'
                                  ? 'bg-rose-500'
                                  : item?.impact === 'Medium'
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <div className="flex items-center gap-1 text-[11px] font-bold text-(--text-muted)">
                              <Clock size={12} />
                              {mounted &&
                                item?.published_at &&
                                formatDistanceToNow(new Date(item?.published_at), {
                                  addSuffix: true,
                                  locale: ko,
                                })}
                            </div>
                            <span className="rounded-md bg-(--secondary-bg) px-1.5 py-0.5 text-[10px] font-black text-(--text-muted) uppercase ">
                              {item?.source}
                            </span>
                            <span className="rounded-md bg-(--background) px-1.5 py-0.5 text-[9px] font-black text-(--text-muted) ">
                              IMPACT: {item?.impact}
                            </span>
                          </div>

                          <h4 className="text-lg font-bold text-(--text-title) group-hover:text-(--primary-strong) transition-colors line-clamp-2">
                            {item?.title}
                          </h4>
                          <p className="line-clamp-2 text-sm font-medium text-(--text-muted) mb-3">
                            {item?.summary}
                          </p>
                          <Tags tags={item?.tags} size={8} />
                        </div>
                      </motion.article>
                    </Link>
                  )}
                />
              </div>
            )}
          </div>
        </main>
      </PullToRefresh>

      <Footer />
    </div>
  );
}