'use client';

import React, { useEffect, useState } from 'react';
import LibPullToRefresh from 'react-simple-pull-to-refresh';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
}

const PULL_THRESHOLD = 40; // px

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

export default function PullToRefresh({ children }: PullToRefreshProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [indicatorTop, setIndicatorTop] = useState(0);

  const onRefresh = async () => {
    window.location.reload();
  };

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    const apply = () => setIsTouchDevice(mql.matches);
    apply();
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
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

  const wrappedChildren = <div className="relative z-10">{children}</div>;

  const indicator = {
    pullingContent: isTouchDevice ? (
      <PTRIndicator indicatorTop={indicatorTop} state="pulling" />
    ) : (
      <span style={{ display: 'none' }} />
    ),
    refreshingContent: isTouchDevice ? (
      <PTRIndicator indicatorTop={indicatorTop} state="refreshing" />
    ) : (
      <span style={{ display: 'none' }} />
    ),
  };

  return (
    <LibPullToRefresh
      isPullable={isTouchDevice}
      onRefresh={onRefresh}
      pullDownThreshold={PULL_THRESHOLD}
      maxPullDownDistance={PULL_THRESHOLD + 20}
      resistance={2.5}
      pullingContent={indicator.pullingContent}
      refreshingContent={indicator.refreshingContent}
      className="relative overflow-hidden overscroll-none"
    >
      {wrappedChildren}
    </LibPullToRefresh>
  );
}
