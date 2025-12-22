'use client';
import { useMainSector } from '@/hooks/useMain';
import {
  AlertCircle,
  BarChart2,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react';

const STANCE_MAP = {
  positive: {
    label: '비중 확대',
    icon: TrendingUp,
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-500/10',
    border: 'border-red-100 dark:border-red-500/20',
  },
  neutral: {
    label: '중립',
    icon: BarChart2,
    color: 'text-slate-500',
    bg: 'bg-slate-50 dark:bg-slate-500/10',
    border: 'border-slate-100 dark:border-slate-500/20',
  },
  cautious: {
    label: '보수적',
    icon: AlertCircle,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    border: 'border-amber-100 dark:border-amber-500/20',
  },
  negative: {
    label: '부정',
    icon: ShieldCheck,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-100 dark:border-blue-500/20',
  },
} as const;

export default function Sector() {
  const { data, isLoading } = useMainSector();
  if (isLoading || !data) return null;
  return (
    <section>
      {/* header */}
      <div className="flex items-end justify-between mb-4 px-1">
        <h3 className="text-lg font-bold text-(--text-title)">
          오늘의 섹터 전략
        </h3>
        <span className="text-xs text-(--text-muted)">
          AI 분석 기반 참고 관점
        </span>
      </div>

      <div className="space-y-3">
        {data.items.slice(0, 3).map((item, idx) => {
          const stance = STANCE_MAP[item.stance];
          const Icon = stance.icon;

          return (
            <div
              key={idx}
              className=" bg-(--card-bg)  border border-(--border)   rounded-xl  transition-all duration-300 ease-out
                hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {item.type === 'etf' && (
                      <span
                        className="
                        text-[10px] font-semibold
                        text-indigo-600 bg-indigo-50
                        px-1.5 py-0.5 rounded
                      "
                      >
                        ETF
                      </span>
                    )}
                    <span className="text-base font-semibold text-(--text-title)">
                      {item.name}
                    </span>
                  </div>

                  <div
                    className={` flex items-center gap-1 px-2 py-0.5 rounded-full border
                      ${stance.bg} ${stance.border}
                    `}
                  >
                    <Icon className={`w-3 h-3 ${stance.color}`} />
                    <span className={`text-[11px] font-bold ${stance.color}`}>
                      {stance.label}
                    </span>
                  </div>
                </div>

                {/* reason */}
                <p className="text-sm text-(--text-muted) leading-relaxed mb-3">
                  {item.reason}
                </p>

                {/* guide */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-(--hover-surface) ">
                  <Target className="w-3.5 h-3.5 text-(--primary) mt-0.5" />
                  <p className="text-[13px] text-(--text-body)">{item.guide}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
