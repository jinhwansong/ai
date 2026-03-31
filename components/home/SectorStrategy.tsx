'use client';

import { MainSectorStrategy } from '@/types/main';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import { sectorStanceDotClass } from '@/components/ui/cardUiStyles';
import { SectionIconBadge } from '@/components/ui/SectionIconBadge';
import SectionHeader from '@/components/ui/SectionHeader';
import { useMainSector } from '@/hooks/query';

export default function SectorStrategy() {
  const { data } = useMainSector();
  const items = (data?.items || []) as MainSectorStrategy['items'];
  return (
    <section className="space-y-6">
      <SectionHeader
        icon={<SectionIconBadge icon={Compass} tone="emerald" />}
        title="오늘의 섹터 전략"
        subtitle="AI 감지 모멘텀 요약"
        className="px-0"
        tooltip="상위 3개 섹터의 모멘텀·스탠스·가이드를 한눈에 보여줍니다."
      />

      <div className="grid gap-3 ">
        {items?.map((sector, index) => (
          <motion.article
            key={sector.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="kakao-card p-6"
          >
            <div className="flex items-start justify-between">
              <h4 className="text-base font-bold text-(--text-title) flex items-center gap-2">
                <span className={sectorStanceDotClass(sector.stance)} />
                {sector.name}
              </h4>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-(--text-muted)">
                  Momentum
                </span>
                <span className="text-xs font-black text-(--text-body)">
                  {sector.label}
                </span>
              </div>
            </div>

            <p className="mt-2 text-xs font-medium leading-relaxed text-(--text-muted) line-clamp-2">
              {sector.reason}
            </p>

            <div className="mt-2 rounded-lg  bg-(--primary-soft) p-3 ">
              <div className="flex items-center gap-2">
                <div className="h-1 w-1 rounded-full bg-(--primary)" />
                <p className="text-[11px] font-bold text-(--text-body) leading-tight">
                  <span className="mr-1 text-(--primary) opacity-80">
                    ACTION :
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
