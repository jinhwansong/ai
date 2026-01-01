'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        }}
      />
    </div>
  );
}

export function SkeletonWrapper({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  // 개선 포인트: AnimatePresence를 사용하여 데이터 로딩 완료 시 부드럽게 전환
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 실제 구현 시 호출하는 쪽에서 Skeleton 구조를 정의하도록 유도하거나 기본 스켈레톤 제공 */}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
