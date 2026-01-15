'use client';

import { getDailyBriefingMeta } from '@/lib/utils/times';
import { motion } from 'framer-motion';
import { Clock, Newspaper } from 'lucide-react';
import Button from '../common/Button';
import SectionHeader from '@/components/common/SectionHeader';
import Tags from '../common/Tags';
import { useMainNews } from '@/hooks/useMain';
import NewsFeedSkeleton from '@/components/skeleton/NewsFeedSkeleton';
import Link from 'next/link';

export default function NewsFeed() {
  const { data, isLoading } = useMainNews();
  const news = data?.news || [];

  if (isLoading) return <NewsFeedSkeleton />;
  return (
    <section className="space-y-6">
      <SectionHeader
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 shadow-lg shadow-rose-500/20">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
        }
        title="오늘의 핵심 뉴스"
        subtitle="AI가 분석한 시장 영향력 기준 뉴스"
        tooltip="오늘 시장에 영향이 큰 뉴스와 관련 섹터를 요약합니다."
        action={
          <Link href="/news">
            <Button variant="link" size="xs">
              전체보기
            </Button>
          </Link>
        }
        className="px-0"
      />

      <div className="space-y-4">
        {news.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="kakao-card group flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
          >
            <Link key={`${item?.id}-${index}`} href={`/news/${item?.id}`}>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.impact === 'High'
                        ? 'bg-(--text-rose)'
                        : item.impact === 'Medium'
                        ? 'bg-(--text-amber)'
                        : 'bg-(--text-green)'
                    }`}
                  />
                  <div className="flex items-center gap-1 text-[10px] font-bold text-(--text-muted)">
                    <Clock size={12} />
                    {getDailyBriefingMeta().publishTime}
                  </div>
                  <span className="rounded-md bg-(--background) px-1.5 py-0.5 text-[9px] font-black text-(--text-muted) ">
                    IMPACT: {item.impact}
                  </span>
                </div>

                <h4 className="text-base font-bold text-(--text-title) group-hover:text-(--primary-strong) transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="line-clamp-1 text-sm font-medium text-(--text-muted) mb-3">
                  {item.summary}
                </p>

                <Tags tags={item.tags} size={8} />
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
