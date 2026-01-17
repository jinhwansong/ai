import { useMountedStore } from '@/stores/useMountedStore';
import { useEffect } from 'react';

export function useIsMounted() {
  const {mounted, setMounted} = useMountedStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}