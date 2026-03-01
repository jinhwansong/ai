import Link from 'next/link';
import { Clock } from 'lucide-react';
import Tags from '@/components/common/Tags';
import { formatPublishedAt } from '@/lib/utils/times';
import type { NewsItem } from '@/types/main';

interface NewsCardProps {
  item: NewsItem;
}

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <Link href={`/news/${item.id}`} className="block">
      <article className="kakao-card group flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between cursor-pointer hover:shadow-lg transition-all border border-(--border)">
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
            <div className="flex items-center gap-1 text-[11px] font-bold text-(--text-muted)">
              <Clock size={12} />
              {formatPublishedAt(item.published_at)}
            </div>
            <span className="rounded-md bg-(--secondary-bg) px-1.5 py-0.5 text-[10px] font-black text-(--text-muted) uppercase ">
              {item.source}
            </span>
            <span className="rounded-md bg-(--background) px-1.5 py-0.5 text-[9px] font-black text-(--text-muted) ">
              IMPACT: {item.impact}
            </span>
          </div>

          <h4 className="text-lg font-bold text-(--text-title) group-hover:text-(--primary-strong) transition-colors line-clamp-2">
            {item.title}
          </h4>
          <p className="line-clamp-2 text-sm font-medium text-(--text-muted) mb-3">
            {item.summary}
          </p>
          <Tags tags={item.tags} size={8} />
        </div>
      </article>
    </Link>
  );
}
