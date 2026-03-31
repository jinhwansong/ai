'use client';

import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { MacroStatusGlyph } from '@/components/ui/MacroStatusGlyph';
import { SectionIconBadge } from '@/components/ui/SectionIconBadge';
import SectionHeader from '@/components/ui/SectionHeader';
import GlobalMacroSkeleton from '@/components/loading/GlobalMacroSkeleton';
import { getMacroStatusMeta } from '@/constants/macroStatus';
import { useMainMacro } from '@/hooks/query';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function GlobalMacro() {
  const { data } = useMainMacro();
  const items = data || [];
  const mounted = useIsMounted();
  if (!mounted) {
    return <GlobalMacroSkeleton />;
  }

  return (
    <section className="space-y-6">
      <SectionHeader
        icon={<SectionIconBadge icon={Globe} tone="indigo" />}
        title="글로벌 시장 요약"
        subtitle="주요 국가지수 실시간 현황"
        className="px-0"
        tooltip="주요 지수의 현재가·등락과 AI 한 줄 코멘트를 요약합니다."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const meta = getMacroStatusMeta(item.status);

          return (
            <motion.article
              key={item.indexName}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="kakao-card group flex flex-col p-5 hover:shadow-lg transition-shadow border "
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-(--text-muted) uppercase tracking-wider">
                  {item.region}
                </span>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black ${meta.color}`}
                >
                  <MacroStatusGlyph status={item.status} />
                  <span>{meta.label}</span>
                </div>
              </div>

              <div className="mb-2">
                <h4 className="text-sm font-bold text-(--text-title) mb-1">{item.indexName}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black tracking-tight text-(--text-title)">
                    {item.value}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      item.change.startsWith('+') ? 'text-rose-500' : 'text-blue-500'
                    }`}
                  >
                    {item.change}
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-(--text-muted) font-medium">
                <span className="text-(--primary) font-bold mr-1">AI</span>
                {item.aiAnalysis}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
