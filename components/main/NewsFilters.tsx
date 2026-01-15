'use client';

import { THE_NEWS_SECTORS } from '@/constants/keyword';

const SORT_OPTIONS = [
  { label: '최신순', value: 'latest' },
  { label: '과거순', value: 'oldest' },
  { label: '중요도순', value: 'importance' },
];

const PERIOD_OPTIONS = [
  { label: '오늘', value: 'today' },
  { label: '1주일', value: 'week' },
  { label: '1개월', value: 'month' },
  { label: '전체', value: 'all' },
];

// 수집(12개 섹터) ↔ 분석(related_sectors) 일관성을 위해 단일 소스 사용
const CATEGORIES = ['전체', ...THE_NEWS_SECTORS.map((s) => s.name)];

interface NewsFiltersProps {
  sort: string;
  setSort: (val: string) => void;
  period: string;
  setPeriod: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
}

export default function NewsFilters({
  sort, setSort,
  period, setPeriod,
  category, setCategory
}: NewsFiltersProps) {
  return (
    <div className="space-y-6">
      {/* 정렬 및 기간 선택 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 p-1 bg-(--secondary-bg) rounded-lg">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                sort === opt.value
                  ? 'bg-(--white-bg) text-(--primary) shadow-sm'
                  : 'text-(--text-muted) hover:text-(--text-title)'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 p-1 bg-(--secondary-bg) rounded-lg">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                period === opt.value
                  ? 'bg-(--white-bg) text-(--primary) shadow-sm'
                  : 'text-(--text-muted) hover:text-(--text-title)'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 카테고리 칩 */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat === '전체' ? 'all' : cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              (category === 'all' && cat === '전체') || category === cat
                ? 'bg-(--white-bg) text-(--primary) shadow-sm border-0'
                : 'bg-(--secondary-bg) text-(--text-body) border-(--border) hover:border-(--primary-strong)  '
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
