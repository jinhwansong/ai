import Skeleton from '../common/Skeleton';

export default function NewsFeedSkeleton({ list = false }: { list?: boolean }) {
  return (
    <section className="space-y-6">
      {!list && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      )}

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <article
            key={i}
            className="kakao-card group flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>

              <Skeleton className="h-5 w-full max-w-md" />

              <Skeleton className="h-4 w-3/4" />

              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-12 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-5 w-14 rounded" />
              </div>
            </div>

            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          </article>
        ))}
      </div>
    </section>
  );
}
