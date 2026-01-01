'use client';

import { motion } from 'framer-motion';

type SectorStrategyProps = {
  sectors: {
    name: string;
    signal: string;
    focus: string;
    momentum: string;
  }[];
};

export default function SectorStrategy({ sectors }: SectorStrategyProps) {
  // 개선 포인트: Masonry 느낌을 위해 높낮이를 살짝 조절하거나 내부 배치를 시각적으로 분리
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-2">
        <h3 className="text-xl font-bold text-(--text-title)">오늘의 섹터 전략</h3>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-(--text-muted)">Sector Focus</span>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {sectors.map((sector, index) => (
          <motion.article
            key={sector.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="kakao-card p-6"
          >
            <div className="flex items-start justify-between">
              <span className={`rounded-lg px-2.5 py-1 text-[10px] font-black tracking-tighter ${
                sector.signal === 'BUY' 
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {sector.signal}
              </span>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-(--text-muted)">Momentum</span>
                <span className="text-xs font-black text-(--text-body)">{sector.momentum}</span>
              </div>
            </div>
            
            <h4 className="mt-3 text-lg font-bold text-(--text-title)">{sector.name}</h4>
            <p className="mt-1 text-sm font-medium text-(--text-muted)">{sector.focus}</p>
            
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-(--light-bg)">
              <motion.div 
                className={`h-full ${sector.momentum === 'Strong' ? 'bg-rose-500' : 'bg-amber-500'}`}
                initial={{ width: 0 }}
                animate={{ width: sector.momentum === 'Strong' ? '85%' : '60%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
