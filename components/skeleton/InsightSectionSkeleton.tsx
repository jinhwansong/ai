import Skeleton from "../common/Skeleton";

export default function InsightSectionSkeleton() {
  return (
    <div className="sticky bottom-6 left-0 right-0 z-40 px-4 md:px-8 pointer-events-none">
      <div className="mx-auto max-w-7xl pointer-events-auto">
        <section className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 md:p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-slate-700 flex items-center justify-center">
              <Skeleton className="w-5 h-5 rounded" />
            </div>
            <div className="flex flex-col space-y-1">
              <Skeleton className="w-20 h-3 bg-slate-400" />
              <Skeleton className="w-16 h-2 bg-slate-500" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <Skeleton className="w-full h-4 bg-slate-400" />
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <div className="hidden md:flex h-1 w-8 rounded-full bg-slate-700"></div>
            <Skeleton className="w-20 h-3 bg-slate-500" />
          </div>
        </section>
      </div>
    </div>
  );
}

