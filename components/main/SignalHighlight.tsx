'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Clock, Map } from 'lucide-react';
import Link from 'next/link';
import Button from '../common/Button';
import { MainSignal } from '@/types/main';
import { getDailyBriefingMeta } from '@/util/times';
import Tags from '../common/Tags';
import { useMainSignal } from '@/hooks/useMain';
import SignalHighlightSkeleton from '@/components/skeleton/SignalHighlightSkeleton';

// 섹션 내부에서 데이터를 직접 fetch하여 Suspense fallback을 활용하는 예시
export default function SignalHighlight() {
  const { data: signal, isLoading } = useMainSignal();
  const {
    focus = '시장 데이터 집계 중',
    description = '시장 데이터 집계 중',
    impactZones = [],
    tags = [],
    updatedAt,
  } = (signal || {}) as MainSignal;

  if (isLoading) return <SignalHighlightSkeleton />;
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="kakao-card relative overflow-hidden p-6 md:p-10"
    >
      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full text-(--text-amber) bg-(--bg-amber) px-3 py-1 text-[10px] font-bold uppercase tracking-wider ">
              <Sparkles size={12} />
              Today&apos;s DETECTED SIGNAL
            </div>
            {updatedAt && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-(--text-muted)">
                <Clock size={12} />
                {getDailyBriefingMeta().publishTime}
              </div>
            )}
          </div>

          <h2 className="line-clamp-1 text-2xl font-bold leading-tight text-(--text-title) md:text-4xl">
            {focus}
          </h2>

          <p className="text-sm leading-relaxed text-(--text-muted) md:text-base line-clamp-2">
            {description}
          </p>
          <p className="text-xs text-(--text-muted) italic opacity-75">
            과거 데이터 기반 추정치이며 실제 시장 상황에 따라 변동될 수
            있습니다.
          </p>
          <Tags tags={tags} size={8} />
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[280px]">
          <div className="flex flex-col rounded-xl bg-(--primary-strong) p-6 text-white shadow-xl shadow-indigo-500/20">
            <div className="mb-4 flex items-center gap-1.5 text-xs font-bold opacity-80">
              <Map size={14} />
              이슈 영향권 (Impact Map)
            </div>

            <div className="flex flex-col gap-3">
              {impactZones.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-bold opacity-90">
                    {item.label}
                  </span>
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-black">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/analysis" className="w-full">
            <Button
              variant="dark"
              size="lg"
              className="group w-full gap-2 rounded-full "
            >
              오늘 포인트 정리
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
