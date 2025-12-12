import { Suspense } from 'react';
import SearchPageClient from '../../components/search/SearchPageClient';

export default function SearchPage() {
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
      <SearchPageClient />
    </Suspense>
  );
}
