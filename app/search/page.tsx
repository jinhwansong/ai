'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSearch } from '@/hooks/useMain';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Newspaper, Eye, TrendingUp, Clock, ChevronRight, ArrowLeft } from 'lucide-react';
import Tags from '@/components/common/Tags';
import Link from 'next/link';
import Modal from '@/components/common/Modal';
import ObservationDetail from '@/components/main/ObservationDetail';
import { ObservationItem } from '@/types/main';
import SearchSkeleton from '@/components/skeleton/SearchSkeleton';
import { formatPublishedAt } from '@/lib/utils/times';

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const router = useRouter();
  const { data, isLoading } = useSearch(query);
  const [selectedObservation, setSelectedObservation] = useState<ObservationItem | null>(null);

  if (isLoading) return <SearchSkeleton/>

  const hasResults = (data?.news?.length ?? 0) > 0 || (data?.observations?.length ?? 0) > 0;

  if (!hasResults) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-(--secondary-bg)">
          <SearchIcon size={40} className="text-(--text-muted) opacity-20" />
        </div>
        <h2 className="text-2xl font-black text-(--text-title)">검색 결과가 없습니다</h2>
        <p className="mt-2 text-(--text-muted) font-medium">
          다른 키워드로 검색해보세요.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-8 flex items-center gap-2 rounded-2xl border border-(--border) px-6 py-3 text-sm font-bold text-(--text-title) hover:bg-(--secondary-bg) transition-colors"
        >
          <ArrowLeft size={18} />
          이전으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 px-4 py-8 md:px-8 mx-auto max-w-4xl space-y-8">
      <div className="space-y-12">
        {/* 종목 및 ETF 결과 */}
        {data?.observations && data.observations.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-lg shadow-amber-500/20">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-(--text-title)">
                관련 종목 및 ETF
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.observations.map((item, index) => (
                <motion.div
                  key={`${item?.name}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedObservation(item)}
                  className="kakao-card group flex cursor-pointer flex-col p-5 transition-all hover:shadow-xl border border-(--border)"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <span className="mb-1 inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-(--text-muted) uppercase">
                        {item.type}
                      </span>
                      <h4 className="text-base font-black text-(--text-title) group-hover:text-(--primary-strong) transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-xs font-bold text-slate-600">
                        {item.symbol}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                        item.momentum === 'Strong'
                          ? 'bg-rose-50 text-rose-500'
                          : item.momentum === 'Moderate'
                          ? 'bg-amber-50 text-(--text-amber)'
                          : 'bg-blue-50 text-blue-500'
                      }`}
                    >
                      <TrendingUp size={10} strokeWidth={3} />
                      <span>{item.momentum}</span>
                    </div>
                  </div>
                  <p className="mb-4 text-xs font-medium leading-relaxed text-(--text-muted) line-clamp-2">
                    {item.reason}
                  </p>
                  <Tags tags={item.tags} size={8} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 뉴스 결과 */}
        {data?.news && data.news.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 shadow-lg shadow-rose-500/20">
                <Newspaper className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-black text-(--text-title)">
                관련 뉴스
              </h2>
            </div>
            <div className="space-y-3">
              {data.news.map((item, index) => (
                <Link key={item.id} href={`/news/${item.id}`}>
                  <motion.article
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="kakao-card group flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between cursor-pointer hover:shadow-lg transition-all border border-(--border) mb-3"
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
                        <span className="rounded-md bg-(--secondary-bg) px-1.5 py-0.5 text-[10px] font-black text-(--text-muted) uppercase">
                          {item.source}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-(--text-title) group-hover:text-(--primary-strong) transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="line-clamp-1 text-xs font-medium text-(--text-muted)">
                        {item.summary}
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className="text-(--text-muted) opacity-30"
                    />
                  </motion.article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 종목 상세 모달 */}
        <Modal
          isOpen={!!selectedObservation}
          onClose={() => setSelectedObservation(null)}
          title="관찰 대상 상세 분석"
          maxWidth="lg"
        >
          {selectedObservation && (
            <ObservationDetail item={selectedObservation} />
          )}
        </Modal>
      </div>
    </main>
  );
}

