import Skeleton from "../common/Skeleton";

export default function SignalHighlightSkeleton() {
  return (
    <section className="kakao-card relative overflow-hidden p-6 md:p-10">
      <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>

          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-40" />

          <div className="flex flex-wrap gap-2 pt-2">
            <Skeleton className="h-6 w-16 rounded-xl" />
            <Skeleton className="h-6 w-20 rounded-xl" />
            <Skeleton className="h-6 w-14 rounded-xl" />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[280px]">
          <div className="flex flex-col rounded-xl bg-(--primary-strong) p-6 text-white shadow-xl shadow-indigo-500/20">
            <Skeleton className="h-4 w-28 mb-4 bg-white/30" />
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 bg-white/30" />
                  <Skeleton className="h-5 w-14 rounded-md bg-white/30" />
                </div>
              ))}
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
      </div>
    </section>
  );
}
