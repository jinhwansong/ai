import Skeleton from "../common/Skeleton";

export default function GlobalMacroSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[100px] rounded-[20px]" />
      ))}
    </div>
  );
}
