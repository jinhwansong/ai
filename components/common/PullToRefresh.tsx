'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
}

const PULL_THRESHOLD = 80; // 당기는 임계치 (px)

export default function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // 모바일/태블릿(터치 기기) 여부 확인
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
  }, []);

  const handlePan = useCallback(
    (_: unknown, info: PanInfo) => {
      if (isRefreshing || !isTouchDevice) return;

      // 페이지 최상단일 때만 작동 (scrollTop === 0)
      // 모바일 브라우저의 기본 오버스크롤 효과와 충돌 방지
      if (window.scrollY > 0) return;

      // 아래로 당길 때만 거리 계산
      if (info.offset.y > 0) {
        // 저항감 부여 (많이 당길수록 덜 움직이게)
        const distance = Math.min(info.offset.y * 0.4, PULL_THRESHOLD + 20);
        setPullDistance(distance);
      }
    },
    [isRefreshing, isTouchDevice]
  );

  const handlePanEnd = useCallback(async () => {
    if (isRefreshing) return;

    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      
      try {
        await onRefresh();
      } finally {
        // 새로고침 완료 후 원위치
        setIsRefreshing(false);
        setPullDistance(0);
        controls.start({ y: 0 });
      }
    } else {
      setPullDistance(0);
      controls.start({ y: 0 });
    }
  }, [isRefreshing, pullDistance, onRefresh, controls]);

  useEffect(() => {
    if (!isRefreshing) {
      controls.start({ y: pullDistance });
    }
  }, [pullDistance, isRefreshing, controls]);

  return (
    <div className={`relative overflow-hidden ${isTouchDevice ? 'touch-none!' : ''}`}>
      {/* 새로고침 인디케이터 - 터치 기기에서만 활성 */}
      {isTouchDevice && (
        <div 
          className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none z-50"
          style={{ height: PULL_THRESHOLD, transform: `translateY(${pullDistance - PULL_THRESHOLD}px)` }}
        >
          <div className="bg-white dark:bg-slate-800 rounded-full p-2 shadow-lg border border-(--border)">
            <motion.div
              animate={isRefreshing ? { rotate: 360 } : { rotate: pullDistance * 2 }}
              transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: "spring", damping: 20 }}
            >
              <RefreshCw 
                size={20} 
                className={pullDistance >= PULL_THRESHOLD ? "text-(--primary-strong)" : "text-(--text-muted)"} 
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* 컨텐츠 영역 */}
      <motion.div
        drag={isTouchDevice ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.5}
        onPan={isTouchDevice ? handlePan : undefined}
        onPanEnd={isTouchDevice ? handlePanEnd : undefined}
        animate={controls}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
