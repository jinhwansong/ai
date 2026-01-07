import Skeleton from "../common/Skeleton";

export default function GlobalMacroSkeleton() {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2.5 px-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div>
          <Skeleton className="h-5 w-36 mb-1" />
          <Skeleton className="h-3 w-44" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="kakao-card group flex flex-col p-5 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>

            <div className="mb-2 space-y-1">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
