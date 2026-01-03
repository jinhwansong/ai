import Skeleton from '../common/Skeleton';

export default function NewsFeedSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[120px] rounded-[24px]" />
      ))}
    </div>
  );
}
