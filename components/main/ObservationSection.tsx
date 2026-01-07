'use client';

import { motion } from 'framer-motion';
import { Eye, TrendingUp } from 'lucide-react';
import { ObservationItem } from '@/types/main';
import SectionHeader from '@/components/common/SectionHeader';
import Tags from '../common/Tags';
import { useMainObservation } from '@/hooks/useMain';
import ObservationSkeleton from '@/components/skeleton/ObservationSkeleton';

export default function ObservationSection() {
  const { data, isLoading } = useMainObservation();
  const items = (data || []) as ObservationItem[];
  if (isLoading) return <ObservationSkeleton />;
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-6">
      <SectionHeader
        icon={
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shadow-lg shadow-amber-500/20">
            <Eye className="h-5 w-5 text-white" />
          </div>
        }
        title="오늘의 관찰 대상"
        subtitle="AI가 주목한 주식 및 ETF 리포트"
        className="px-0"
        tooltip="AI가 오늘 주목한 종목/ETF와 선정 이유를 요약합니다."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <motion.div
            key={item.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="kakao-card group flex flex-col p-5 transition-all hover:shadow-xl border border-slate-100 dark:border-slate-800"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <span className="mb-1 inline-block rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-black text-slate-500 uppercase dark:bg-slate-800">
                  {item.type}
                </span>
                <h4 className="text-base font-black text-(--text-title) group-hover:text-(--primary-strong) transition-colors">
                  {item.name}
                </h4>
                <span className="text-xs font-bold text-slate-400">
                  {item.symbol}
                </span>
              </div>
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
                  item.momentum === 'Strong'
                    ? 'bg-rose-50 text-rose-500'
                    : item.momentum === 'Moderate'
                    ? 'bg-amber-50 text-amber-500'
                    : 'bg-blue-50 text-blue-500'
                }`}
              >
                <TrendingUp size={10} strokeWidth={3} />
                <span>{item.momentum}</span>
              </div>
            </div>

            <p className="mb-4 flex-1 text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
              {item.reason}
            </p>

            <Tags tags={item.tags} size={8} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

