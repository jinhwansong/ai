import Skeleton from "../common/Skeleton";

export default function ObservationSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2.5 px-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="kakao-card group flex flex-col p-5"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <Skeleton className="h-4 w-12 mb-1" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-16 mt-1" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <Skeleton className="h-3 w-full mb-1" />
            <Skeleton className="h-3 w-4/5 mb-1" />
            <Skeleton className="h-3 w-3/5" />

            <div className="mt-auto pt-3 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                <Skeleton className="h-4 w-12 rounded-full" />
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-4 w-10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
