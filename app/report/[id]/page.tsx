'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useDailyReport } from '@/query/useReport';

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const date = searchParams.get('date') ?? undefined;

  // NOTE: current API/query doesn't accept date; we keep the query param for future,
  // and still show the latest daily report.
  const index = Number(params?.id);
  const { data, isLoading, error } = useDailyReport();

  const issue =
    Number.isFinite(index) && index >= 0 ? data?.issues?.[index] : undefined;

  return (
    <div className="px-5 py-8">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-sm text-(--text-muted) hover:underline">
          ← 홈으로
        </Link>
        {date && (
          <span className="text-xs text-(--text-muted-light)">date: {date}</span>
        )}
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
            <p className="text-(--text-muted)">불러오는 중…</p>
          </div>
        )}

        {error && (
          <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
            <p className="text-(--text-body)">
              데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </p>
          </div>
        )}

        {!isLoading && !error && !issue && (
          <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
            <p className="text-(--text-body)">
              해당 브리핑을 찾을 수 없습니다.
            </p>
          </div>
        )}

        {issue && (
          <article className="p-6 rounded-xl border border-(--border) bg-(--card-bg) shadow-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-(--text-title)">
              {issue.title}
            </h1>
            <p className="text-(--text-body) mt-4 leading-relaxed">
              {issue.summary}
            </p>
            <div className="mt-5 p-4 rounded-lg bg-(--primary-sub)">
              <p className="text-sm font-medium text-(--text-title)">
                한국 시장 영향
              </p>
              <p className="text-(--text-body) mt-1">{issue.koreaImpact}</p>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

