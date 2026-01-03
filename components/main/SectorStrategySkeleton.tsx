import Skeleton from "../common/Skeleton";

export default function SectorStrategySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[200px] rounded-[32px]" />
      ))}
    </div>
  );
}
