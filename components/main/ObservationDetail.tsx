'use client';

import { ObservationItem } from '@/types/main';
import { TrendingUp, BadgeCheck, Info, Newspaper, ChevronRight } from 'lucide-react';
import Tags from '../common/Tags';
import { motion } from 'framer-motion';

type ObservationDetailProps = {
  item: ObservationItem;
};

export default function ObservationDetail({ item }: ObservationDetailProps) {
  const handleNewsClick = (url: string | null, title: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      const searchUrl = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(title)}`;
      window.open(searchUrl, '_blank');
    }
  };

  const momentumColor = 
    item.momentum === 'Strong' ? 'text-rose-500 bg-rose-50 border-rose-100' :
    item.momentum === 'Moderate' ? 'text-(--text-amber) bg-amber-50 border-amber-100' :
    'text-blue-500 bg-blue-50 border-blue-100';

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-col ">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[10px]  text-slate-500 uppercase ">
            <BadgeCheck size={12} />
            {item.type}
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-md border font-black ${momentumColor}`}
          >
            <TrendingUp size={16} strokeWidth={3} />
            <span>{item.momentum}</span>
          </div>
        </div>
        <h2 className="text-xl font-black text-(--text-title) tracking-tight">
          {item.name}
        </h2>
        <p className="text-sm font-bold text-(--text-muted)">{item.symbol}</p>
      </div>

      <div className="h-px w-full bg-(--border)" />

      {/* Analysis Reason */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 text-(--text-amber)">
          <Info size={15} />
          <h3 className="text-sm font-black">AI 선정 이유</h3>
        </div>
        <div className="rounded-2xl bg-(--primary-soft) p-6 ">
          <p className="text-sm font-medium leading-relaxed text-(--text-title)">
            {item.reason}
          </p>
        </div>
      </div>

      {item.relatedNews && item.relatedNews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-(--text-title)">
            <Newspaper size={20} />
            <h3 className="text-sm font-black">주요 관련 뉴스</h3>
          </div>
          <div className="space-y-3">
            {item.relatedNews.map((news, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleNewsClick(news.url, news.title)}
                className="kakao-card flex cursor-pointer items-center justify-between p-4 border border-(--border)"
              >
                <div className="flex-1 pr-4">
                  <h4 className="mb-1 line-clamp-1 text-sm font-bold text-(--text-title)">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-(--text-muted)">
                    <span>{news.source}</span>
                    <span className="h-1 w-1 rounded-full bg-(--border)" />
                    <span>{news.time}</span>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-(--text-muted) opacity-30"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <Tags tags={item.tags} size={10} />

      <div className="rounded-xl border border-dashed border-slate-200 p-4 dark:border-slate-800">
        <p className="text-center text-xs font-medium text-slate-400">
          본 리포트는 AI에 의해 생성되었으며 투자 권유가 아닙니다. <br />
          최종 투자 결정은 반드시 본인의 판단하에 이루어져야 합니다.
        </p>
      </div>
    </div>
  );
}
