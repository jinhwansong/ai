'use client';

import { motion } from 'framer-motion';
import Button from '../common/Button';

import { PortfolioPerformanceItem, PortfolioHoldingItem } from '@/types/main';

type PortfolioProps = {
  performance: PortfolioPerformanceItem[];
  holdings: PortfolioHoldingItem[];
};

export default function Portfolio({ performance, holdings }: PortfolioProps) {
  // 개선 포인트: 데이터 밀도가 높은 영역을 시각적으로 깔끔하게 분할하고 progress bar 등을 활용
  return (
    <section className="kakao-card overflow-hidden p-0">
      <div className="grid md:grid-cols-[1fr_auto_1.2fr]">
        <div className="p-8">
          <h3 className="text-lg font-bold text-(--text-title)">
            시뮬레이션 포트폴리오
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            과거 데이터 기반 가상 포트폴리오 시뮬레이션
          </p>

          <div className="mt-8 space-y-6">
            {performance.map((item) => (
              <div
                key={item.label}
                className="flex items-end justify-between border-b border-slate-50 pb-4 dark:border-slate-800"
              >
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-black text-(--text-title)">
                    {item.value}
                  </p>
                </div>
                <span className="mb-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {item.delta}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden w-px bg-(--border) md:block"></div>

        <div className="bg-(--light-bg) p-8 dark:bg-slate-900/30">
          <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">
            Major Holdings
          </h4>

          <div className="mt-6 space-y-5">
            {holdings.map((holding) => (
              <div key={holding.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-(--text-title)">
                    {holding.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-(--text-body)">
                      {holding.ratio}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500">
                      {holding.change}
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <motion.div
                    className="h-full bg-(--primary)"
                    initial={{ width: 0 }}
                    animate={{ width: holding.ratio }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            full
            className="mt-8 rounded-2xl bg-white shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            자산 배분 히스토리 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
