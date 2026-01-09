import Skeleton from '@/components/common/Skeleton';

export default function SearchSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="h-40 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
