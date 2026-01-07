'use client';
import { Sparkles } from 'lucide-react';
import { InsightItem } from '@/types/main';
import { useMainInsight } from '@/hooks/useMain';
import InsightSectionSkeleton from '@/components/skeleton/InsightSectionSkeleton';

export default function InsightSection() {
  const { data, isLoading } = useMainInsight();
  const insight = data as InsightItem | undefined;

  if (isLoading) return <InsightSectionSkeleton />;
  return (
    <div className="sticky bottom-6 left-0 right-0 z-40 px-4 md:px-8 pointer-events-none">
      <div className="mx-auto max-w-7xl pointer-events-auto">
        <section className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 md:p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6 group transition-all hover:bg-slate-900">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                AI 한 줄 요약
              </span>
              <span className="text-xs font-bold text-slate-500">
                Live Insight
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-sm md:text-base font-bold text-white leading-relaxed">
              &ldquo;
              {insight?.summary ||
                '반도체 수출 호조와 연준의 비둘기파적 발언으로 국내 증시의 단기 반등 모멘텀이 강화되고 있습니다.'}
              &ldquo;
            </p>
            <p className="mt-1 text-[11px] font-medium text-slate-400">
              초보자를 위한 한 줄 요약입니다. 투자 판단은 별도로 확인하세요.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <div className="hidden md:flex h-1 w-8 rounded-full bg-slate-700"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight italic">
              AI Interpretation
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
