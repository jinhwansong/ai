import Skeleton from '@/components/common/Skeleton';

export default function SearchSkeleton() {
  return (
    <main className="flex-1 px-4 py-8 md:px-8 mx-auto max-w-4xl space-y-8">
      <div className="space-y-12">
        <div className="space-y-10">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-40 rounded-2xl"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className="h-24 rounded-2xl"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
