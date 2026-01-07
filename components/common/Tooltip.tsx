'use client';

import { ReactNode, useState } from 'react';
import { Info } from 'lucide-react';
import clsx from 'clsx';

type TooltipProps = {
  content: ReactNode;
  side?: 'top' | 'bottom';
  className?: string;
};

export default function Tooltip({
  content,
  side = 'top',
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  const position =
    side === 'top'
      ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
      : 'top-full mt-2 left-1/2 -translate-x-1/2';

  return (
    <div
      className={clsx('relative inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      tabIndex={0}
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--hover-surface) text-(--text-muted) hover:text-(--text-body)">
        <Info size={14} />
      </div>

      {open && (
        <div
          className={clsx(
            'absolute z-50 w-64 rounded-xl border border-(--border) bg-(--background) p-3 text-[11px] leading-relaxed text-(--text-body) shadow-xl',
            position
          )}
        >
          {content}
          <div
            className={clsx(
              'absolute h-2 w-2 rotate-45 bg-(--background) border border-(--border)',
              side === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2 border-t-0 border-l-0'
                : 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-b-0 border-r-0'
            )}
          />
        </div>
      )}
    </div>
  );
}

