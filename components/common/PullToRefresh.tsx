'use client';

import React, { useEffect, useMemo, useState } from 'react';
import LibPullToRefresh from 'react-simple-pull-to-refresh';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
}

const PULL_THRESHOLD = 20; // px

function PTRIndicator({
  indicatorTop,
  state,
}: {
  indicatorTop: number;
  state: 'pulling' | 'refreshing';
}) {
  return (
    <div
      className="flex w-full justify-center items-center"
      style={{ paddingTop: indicatorTop, height: PULL_THRESHOLD + indicatorTop }}
    >
      <div className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg border border-(--border)">
        <motion.div
          animate={state === 'refreshing' ? { rotate: 360 } : { rotate: 180 }}
          transition={
            state === 'refreshing'
              ? { repeat: Infinity, duration: 1, ease: 'linear' }
              : { type: 'spring', damping: 20 }
          }
        >
          <RefreshCw size={20} className="text-(--primary-strong)" />
        </motion.div>
      </div>
    </div>
  );
}

export default function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [indicatorTop, setIndicatorTop] = useState(0);

  useEffect(() => {
    // 모바일/태블릿(터치 기기) 여부 확인
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
  }, []);

  useEffect(() => {
    const computeTop = () => {
      const header = document.querySelector('header.glass-header') as HTMLElement | null;
      const h = header?.getBoundingClientRect().height ?? 0;
      setIndicatorTop(h);
    };

    computeTop();
    window.addEventListener('resize', computeTop);
    return () => window.removeEventListener('resize', computeTop);
  }, []);

  const indicator = useMemo(
    () => ({
      pullingContent: <PTRIndicator indicatorTop={indicatorTop} state="pulling" />,
      refreshingContent: (
        <PTRIndicator indicatorTop={indicatorTop} state="refreshing" />
      ),
    }),
    [indicatorTop]
  );

  const wrappedChildren = useMemo(
    () => <div className="relative z-10">{children}</div>,
    [children]
  );

  return (
    <LibPullToRefresh
      isPullable={isTouchDevice}
      onRefresh={onRefresh}
      pullDownThreshold={PULL_THRESHOLD}
      maxPullDownDistance={PULL_THRESHOLD + 20}
      resistance={2.5}
      pullingContent={indicator.pullingContent}
      refreshingContent={indicator.refreshingContent}
      className="relative overflow-hidden"
    >
      {wrappedChildren}
    </LibPullToRefresh>
  );
}
