import { Suspense } from 'react';
import ReportDetailClient from './ReportDetailClient';

export default function ReportDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="px-5 py-8">
          <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
            <p className="text-(--text-muted)">불러오는 중…</p>
          </div>
        </div>
      }
    >
      <ReportDetailClient />
    </Suspense>
  );
}

