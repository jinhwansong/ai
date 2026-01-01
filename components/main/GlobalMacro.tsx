'use client';

import { motion } from 'framer-motion';
import { Globe, AlertCircle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

export type MacroStatus = 'positive' | 'neutral' | 'cautious' | 'negative';

export type GlobalMacroItem = {
  region: string;
  indexName: string;
  value: string;
  change: string;
  status: MacroStatus;
};

type GlobalMacroProps = {
  data: GlobalMacroItem[];
};

const statusConfig = {
  positive: {
    label: '호재',
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    icon: CheckCircle2,
  },
  neutral: {
    label: '관망',
    color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    icon: HelpCircle,
  },
  cautious: {
    label: '유의',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    icon: AlertCircle,
  },
  negative: {
    label: '악재',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    icon: XCircle,
  },
};

export default function GlobalMacro({ data }: GlobalMacroProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-2">
        <h3 className="text-xl font-bold text-(--text-title)">글로벌 매크로</h3>
        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] text-(--text-muted)">
          <Globe size={12} />
          <span>Global Markets</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item, index) => {
          const config = statusConfig[item.status];
          const StatusIcon = config.icon;

          return (
            <motion.article
              key={item.region}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="kakao-card group flex items-center justify-between p-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-(--text-muted) uppercase tracking-tighter">
                    {item.region}
                  </span>
                  <div className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-black ${config.color}`}>
                    <StatusIcon size={10} strokeWidth={3} />
                    <span>{config.label}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-(--text-title)">{item.indexName}</h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black tracking-tight text-(--text-title)">{item.value}</span>
                  <span className={`text-[11px] font-bold ${item.change.startsWith('+') ? 'text-rose-500' : 'text-blue-500'}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

