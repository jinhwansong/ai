import React from 'react';
import Skeleton from '../common/Skeleton';

export default function AnalysisSkelton() {
  return (
    <div className="min-h-screen bg-(--background)">
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-(--border) px-4 backdrop-blur-md ">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-5 py-8 space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      </main>
    </div>
  );
}
