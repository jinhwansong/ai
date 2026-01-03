'use client';

import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import Button from '../common/Button';
import { MainSignal } from '@/types/main';
import { getDailyBriefingMeta } from '@/util/times';

export default function SignalHighlight({
  focus = '시장 데이터 집계 중',
  description= '시장 데이터 집계 중',
  value,
  change,
  tags,
  updatedAt,
}: MainSignal) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="kakao-card relative overflow-hidden p-6 md:p-10"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-(--primary-soft) opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-40 w-40 rounded-full bg-indigo-500 opacity-10 blur-3xl"></div>

      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <Sparkles size={12} />
              Today&apos;s DETECTED SIGNAL
            </div>
            {updatedAt && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <Clock size={12} />
                {getDailyBriefingMeta().publishTime} 브리핑
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold leading-tight text-(--text-title) md:text-4xl lg:text-5xl">
            {focus}
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-(--text-muted) md:text-base">
            {description}
          </p>
          <p className="text-xs text-(--text-muted) italic opacity-75">
            과거 데이터 기반 추정치이며 실제 시장 상황에 따라 변동될 수
            있습니다.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="rounded-xl bg-(--light-bg) px-3 py-1.5 text-xs font-bold text-(--text-body) border border-(--border)"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto lg:flex-col">
          <div className="flex flex-col items-center justify-center rounded-[32px] bg-(--primary-strong) p-6 text-white shadow-xl shadow-indigo-500/20 md:p-8">
            <div className="flex items-center gap-1.5 self-start text-xs font-bold opacity-80">
              <TrendingUp size={14} />
              AI 추정 성장 지수
            </div>
            <div className="my-2 text-5xl font-black md:text-6xl">{value}</div>
            <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
              {change}
            </div>
          </div>

          <Button
            variant="dark"
            size="lg"
            className="group gap-2 rounded-full "
          >
            전체 분석 리포트 보기
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
