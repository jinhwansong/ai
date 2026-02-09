'use client';

import { useEffect, useRef, useState, startTransition, type RefObject } from 'react';

export interface PerformanceMetricResult {
  elapsedMs: number;
  domNodes: number;
  measuredAt: string;
  label: string;
}

interface UsePerformanceMetricsOptions {
  active: boolean;
  targetRef: RefObject<HTMLElement | null>;
  trigger?: number | string;
  label?: string;
}

export function usePerformanceMetrics({
  active,
  targetRef,
  trigger,
  label = 'target',
}: UsePerformanceMetricsOptions) {
  const [metrics, setMetrics] = useState<PerformanceMetricResult | null>(null);
  const measuredRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const prevActiveRef = useRef(active);

  // Separate effect to handle reset when active becomes false
  useEffect(() => {
    if (!active && prevActiveRef.current) {
      measuredRef.current = false;
      startTimeRef.current = null;
      startTransition(() => {
        setMetrics(null);
      });
    }
    prevActiveRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!active) {
      return;
    }

    if (!trigger || trigger === 0 || measuredRef.current) {
      return;
    }

    // Set start time when measurement begins
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }

    const frame = requestAnimationFrame(() => {
      const node = targetRef.current;
      if (!node || startTimeRef.current === null) {
        return;
      }

      const finish = performance.now();
      measuredRef.current = true;
      setMetrics({
        elapsedMs: finish - startTimeRef.current,
        domNodes: node.getElementsByTagName('*').length + 1,
        measuredAt: new Date().toISOString(),
        label,
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [active, label, targetRef, trigger]);

  return metrics;
}
