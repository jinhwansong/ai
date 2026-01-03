'use client';

import { MainSectorStrategy } from '@/types/main';
import { motion } from 'framer-motion';

export default function SectorStrategy({ items }: MainSectorStrategy) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-2">
        <div className="flex gap-4">
          <h3 className="text-xl font-bold text-(--text-title)">
            오늘의 섹터 전략
          </h3>
          <p className="text-xs text-(--text-muted) mt-2">
            AI가 감지한 섹터별 모멘텀 방향성 요약입니다.
          </p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-(--text-muted)">
          Sector Focus
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items?.map((sector, index) => (
          <motion.article
            key={sector.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="kakao-card p-6"
          >
            <div className="flex items-start justify-between">
              <span
                className={`rounded-md px-2.5 py-1 text-[10px] font-black tracking-tighter ${
                  sector.stance === 'POSITIVE'
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {sector.stance}
              </span>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-(--text-muted)">
                  Momentum
                </span>
                <span className="text-xs font-black text-(--text-body)">
                  {sector.label}
                </span>
              </div>
            </div>

            <h4 className="mt-3 text-lg font-bold text-(--text-title)">
              {sector.name}
            </h4>
            <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 line-clamp-2">
              {sector.reason}
            </p>
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-(--light-bg)">
              <motion.div
                className={`h-full ${
                  sector.label === 'Strong' ? 'bg-rose-500' : 'bg-amber-500'
                }`}
                initial={{ width: 0 }}
                animate={{
                  width: sector.label === 'Strong' ? '85%' : '60%',
                }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="mt-4 rounded-lg bg-(--light-bg) p-3 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-(--primary)"></div>
                <p className="text-[11px] font-bold text-(--text-body) leading-tight">
                  <span className="mr-1 text-(--primary) opacity-80">
                    ACTION:
                  </span>
                  {sector.guide}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
