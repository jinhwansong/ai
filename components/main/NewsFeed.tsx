'use client';

import { NewsFeedProps } from '@/types/main';
import { getDailyBriefingMeta } from '@/util/times';
import { motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';

export default function NewsFeed({ news }: NewsFeedProps) {
  // 개선 포인트: 본문은 text-slate-500 정도로 대비를 주어 가독성을 높이고 카드 내 위계 정리
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between px-2">
        <div className="flex gap-2 items-center">
          <h3 className="text-xl font-bold text-(--text-title)">
            주요 마켓 브리핑
          </h3>
          <span className="text-[10px] text-(--text-muted)">
            Generated at {getDailyBriefingMeta().publishTime}
          </span>
        </div>
        <button className="text-xs font-bold text-(--primary-strong) hover:underline">
          전체보기
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="kakao-card group flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 rounded-full ${
                    item.impact === 'High'
                      ? 'bg-rose-500'
                      : item.impact === 'Medium'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                  <Clock size={12} />
                  {getDailyBriefingMeta().publishTime}
                </div>
                <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[9px] font-black text-slate-400 dark:bg-slate-800">
                  IMPACT: {item.impact}
                </span>
              </div>

              <h4 className="text-base font-bold text-(--text-title) group-hover:text-(--primary-strong) transition-colors line-clamp-1">
                {item.title}
              </h4>
              <p className="line-clamp-1 text-sm font-medium text-slate-500">
                {item.summary}
              </p>
            </div>

            <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--light-bg) text-slate-400 transition-all group-hover:bg-(--primary-soft) group-hover:text-(--primary-strong)">
              <ExternalLink size={18} />
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
