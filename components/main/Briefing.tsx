'use client';

import { useMainBriefing } from '@/hooks/useMain';
import { ChevronRight } from 'lucide-react';

export default function Briefing() {
  const { data, isLoading } = useMainBriefing();

  if (isLoading || !data) return null;
  const [first, ...rest] = data.title.split(',');

  return (
    <section className="rounded-2xl p-7 bg-(--foreground) ">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-(--primary) text-(--text-white)">
          TODAY
        </span>
        <span className="text-xs text-(--text-muted)">{data.date}</span>
      </div>

      <h2 className="text-[22px] font-bold leading-snug mb-3 text-(--text-white)">
        {first},
        <br />
        <span className="text-(--primary)">{rest.join(',')}</span>
      </h2>

      <p className="text-sm text-(--text-muted) mb-6 line-clamp-2">
        {data.summary}
      </p>

      <button className="w-full py-4 rounded-xl font-semibold text-base flex  items-center justify-center  gap-2 bg-(--primary) text-(--text-white) hover:brightness-95 transition-colors ">
        <span>전체 브리핑 읽기</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}
