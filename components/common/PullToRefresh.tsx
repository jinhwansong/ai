'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
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
  const startYRef = useRef<number | null>(null);

  useEffect(() => {
    // 모바일/태블릿(터치 기기) 여부 확인
    const checkTouch = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };
    checkTouch();
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isTouchDevice || isRefreshing) return;
      // 최상단에서만 PTR 시작 (그 외는 기본 스크롤을 방해하지 않음)
      if (window.scrollY > 0) return;
      startYRef.current = e.touches[0]?.clientY ?? null;
    },
    [isTouchDevice, isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isTouchDevice || isRefreshing) return;
      if (startYRef.current === null) return;

      // 최상단이 아니면 즉시 PTR 해제 (스크롤 방해 방지)
      if (window.scrollY > 0) {
        startYRef.current = null;
        setPullDistance(0);
        return;
      }

      const currentY = e.touches[0]?.clientY ?? 0;
      const dy = currentY - startYRef.current;

      if (dy <= 0) {
        setPullDistance(0);
        return;
      }

      // 아래로 당길 때만 거리 계산 (저항감 부여)
      const distance = Math.min(dy * 0.4, PULL_THRESHOLD + 20);
      setPullDistance(distance);

      // iOS 오버스크롤/바운스와 충돌 방지 (최상단에서 아래로 당길 때만)
      e.preventDefault();
    },
    [isTouchDevice, isRefreshing]
  );

  const finish = useCallback(() => {
    startYRef.current = null;
    setPullDistance(0);
    controls.start({ y: 0 });
  }, [controls]);

  const handleTouchEnd = useCallback(async () => {
    if (!isTouchDevice) return;
    if (isRefreshing) return;

    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        finish();
      }
      return;
    }

    finish();
  }, [isTouchDevice, isRefreshing, pullDistance, onRefresh, finish]);

  useEffect(() => {
    if (!isRefreshing) {
      controls.start({ y: pullDistance });
    }
  }, [pullDistance, isRefreshing, controls]);

  return (
    <div className="relative overflow-hidden">
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
        onTouchStart={isTouchDevice ? handleTouchStart : undefined}
        onTouchMove={isTouchDevice ? handleTouchMove : undefined}
        onTouchEnd={isTouchDevice ? handleTouchEnd : undefined}
        onTouchCancel={isTouchDevice ? handleTouchEnd : undefined}
        animate={controls}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
}
