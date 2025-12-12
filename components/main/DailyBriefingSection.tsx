'use client';
import DailyCard from './DailyCard';
import DailySkeleton from './DailySkeleton';
import { useDailyReport } from '@/query/useReport';

export default function DailyBriefingSection() {
  const { data, isLoading } = useDailyReport();

  return (
    <section>
      <h2 className="text-xl font-semibold text-(--text-title) mb-4">
        오늘의 브리핑
      </h2>

      {isLoading && <DailySkeleton />}

      <div className="space-y-4">
        {data?.issues?.map((issue, i) => (
          <DailyCard key={i} issue={issue} index={i} date={data?.date} />
        ))}
      </div>
    </section>
  );
}
