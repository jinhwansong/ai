import { THE_NEWS_SECTORS } from '@/constants';
import Skeleton from '../common/Skeleton';

const SORT_COUNT = 3;
const PERIOD_COUNT = 4;
const CATEGORY_COUNT = 1 + THE_NEWS_SECTORS.length;

export default function NewsFiltersSkeleton() {
  return (
    <div className="space-y-6">
      {/* 정렬 및 기간 선택 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-(--secondary-bg) rounded-lg">
          {Array.from({ length: SORT_COUNT }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-md" />
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 bg-(--secondary-bg) rounded-lg">
          {Array.from({ length: PERIOD_COUNT }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-14 rounded-md" />
          ))}
        </div>
      </div>

      {/* 카테고리 칩 */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: CATEGORY_COUNT }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );
}
