import Skeleton from "../common/Skeleton";

export default function SectorStrategySkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2.5 px-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      <div className="grid gap-3">
        {[1, 2, 3].map((i) => (
          <article key={i} className="kakao-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-2 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex flex-col items-end">
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-4 w-10" />
              </div>
            </div>

            <Skeleton className="h-3 w-full mt-2" />
            <Skeleton className="h-3 w-3/4 mt-1" />

            <div className="mt-2 rounded-lg bg-(--light-bg) p-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
