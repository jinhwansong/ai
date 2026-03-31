import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

export type SectionIconTone = 'indigo' | 'rose' | 'emerald' | 'amber';

const TONE_CLASS: Record<SectionIconTone, string> = {
  indigo: 'bg-indigo-500 shadow-lg shadow-indigo-500/20',
  rose: 'bg-rose-500 shadow-lg shadow-rose-500/20',
  emerald: 'bg-emerald-500 shadow-lg shadow-emerald-500/20',
  amber: 'bg-amber-500 shadow-lg shadow-amber-500/20',
};

type SectionIconBadgeProps = {
  icon: LucideIcon;
  tone: SectionIconTone;
  className?: string;
};

/** 섹션 헤더 등에 쓰는 8×8 컬러 아이콘 래퍼 */
export function SectionIconBadge({ icon: Icon, tone, className }: SectionIconBadgeProps) {
  return (
    <div
      className={clsx(
        'flex h-8 w-8 items-center justify-center rounded-lg',
        TONE_CLASS[tone],
        className,
      )}
    >
      <Icon className="h-5 w-5 text-white" aria-hidden />
    </div>
  );
}
