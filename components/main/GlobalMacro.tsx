'use client';

import { motion } from 'framer-motion';
import { Globe, AlertCircle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import SectionHeader from '@/components/common/SectionHeader';
import { useMainMacro } from '@/hooks/useMain';
import { GlobalMacroItem } from '@/types/main';
import GlobalMacroSkeleton from '@/components/skeleton/GlobalMacroSkeleton';

const statusConfig = {
  positive: {
    label: '호재',
    color: 'bg-(--bg-rose) text-(--text-rose)',
    icon: CheckCircle2,
  },
  neutral: {
    label: '관망',
    color: 'bg-(--secondary-bg) text-(--text-muted)',
    icon: HelpCircle,
  },
  cautious: {
    label: '유의',
    color: 'bg-(--bg-amber) text-(--text-amber)',
    icon: AlertCircle,
  },
  negative: {
    label: '악재',
    color: 'bg-(--bg-blue) text-(--text-blue)',
    icon: XCircle,
  },
};

export default function GlobalMacro() {
  const { data, isLoading } = useMainMacro();
  const items = (data || []) as GlobalMacroItem[];

  if (isLoading) return <GlobalMacroSkeleton />;

  return (
    <section className="space-y-6">
      <SectionHeader
        icon={
          <div className="flex h-8 w-8 items-center  justify-center rounded-lg bg-indigo-500 shadow-lg shadow-indigo-500/20">
            <Globe className="h-5 w-5 text-white" />
          </div>
        }
        title="글로벌 시장 요약"
        subtitle="주요 국가지수 실시간 현황"
        className="px-0"
        tooltip="주요 지수의 현재가·등락과 AI 한 줄 코멘트를 요약합니다."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;

          return (
            <motion.article
              key={item.indexName}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="kakao-card group flex flex-col p-5 hover:shadow-lg transition-shadow border "
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-(--text-muted) uppercase tracking-wider">
                  {item.region}
                </span>
                <div
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black ${config.color}`}
                >
                  <StatusIcon size={10} strokeWidth={3} />
                  <span>{config.label}</span>
                </div>
              </div>

              <div className="mb-2">
                <h4 className="text-sm font-bold text-(--text-title) mb-1">
                  {item.indexName}
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black tracking-tight text-(--text-title)">
                    {item.value}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      item.change.startsWith('+')
                        ? 'text-rose-500'
                        : 'text-blue-500'
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

