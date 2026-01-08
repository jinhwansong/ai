'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

type SkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
};

export default function Skeleton({
  className,
  width,
  height,
  circle,
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        'relative overflow-hidden bg-slate-200 dark:bg-slate-800',
        circle ? 'rounded-full' : 'rounded-2xl',
        className
      )}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 z-10"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        }}
      />
    </div>
  );
}
