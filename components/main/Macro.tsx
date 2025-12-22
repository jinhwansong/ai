'use client';
import { useMainMacro } from '@/hooks/useMain';
import clsx from 'clsx';
import { AlertTriangle, ArrowRight, Minus, TrendingUp } from 'lucide-react';

const MACRO_MAP = {
  positive: {
    label: '강세',
    subLabel: 'Bullish',
    icon: TrendingUp,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'hover:border-red-500/50',
  },
  neutral: {
    label: '보합',
    subLabel: 'Neutral',
    icon: Minus,
    color: 'text-slate-500',
    bg: 'bg-slate-500/10',
    border: 'hover:border-slate-500/50',
  },
  cautious: {
    label: '주의',
    subLabel: 'Cautious',
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'hover:border-amber-500/50',
  },
  negative: {
    label: '약세',
    subLabel: 'Bearish',
    icon: TrendingUp,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'hover:border-blue-500/50',
  },
};
const REGIONS = [
  { key: 'us', label: '미국' },
  { key: 'china', label: '중국' },
  { key: 'eu', label: '유럽' },
  { key: 'japan', label: '일본' },
] as const;

export default function Macro() {
  const { data, isLoading } = useMainMacro();
  if (isLoading || !data) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 ">
          <h3 className="text-lg font-bold text-(--text-title)">
            글로벌 시장 흐름
          </h3>
          <span className="text-xs text-(--text-muted)">
            {data.date} · {data.publishTime}
          </span>
        </div>
        <span className="px-2 py-1 text-xs rounded-md bg-(--primary-soft) text-(--primary) font-medium">
          AI Analysis
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {REGIONS.map(({ key, label }) => {
          const stateKey = data.globalMacro[key] || 'neutral';
          const state = MACRO_MAP[stateKey as keyof typeof MACRO_MAP];
          const Icon = state.icon;
          const isNegative = stateKey === 'negative';

          return (
            <div
              key={key}
              className={clsx(
                ` group relative flex flex-col justify-between h-28 p-4 rounded-2xl 
                bg-(--card-bg) border border-(--border)
                transition-all duration-300 ease-out
                hover:shadow-md hover:-translate-y-0.5 cursor-pointer
                ${state.border}`
              )}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold text-(--text-body) group-hover:text-(--text-title) transition-colors">
                  {label}
                </span>
                <div
                  className={`p-1.5 rounded-full ${state.bg} ${state.color}`}
                >
                  <Icon
                    className={`w-4 h-4 ${isNegative ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>

              <div>
                <span className="text-xs text-(--text-muted) block mb-0.5">
                  {state.subLabel}
                </span>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-lg font-extrabold tracking-tight ${state.color}`}
                  >
                    {state.label}
                  </span>

                  {/* Hover 시 나타나는 화살표 (Micro interaction) */}
                  <ArrowRight className="w-4 h-4 text-(--text-muted) opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
