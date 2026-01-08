import { useEffect, useState } from 'react';
import { animate, useMotionValue, useTransform } from 'framer-motion';

export function useAnimatedScore({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: 'easeOut' });
    return controls.stop;
  }, [count, value]);

  useEffect(() => {
    return rounded.on('change', (latest) => setDisplayValue(latest));
  }, [rounded]);

  return displayValue;
}
