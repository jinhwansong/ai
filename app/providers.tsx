'use client';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    useOnboardingStore.getState()._hydrate();
  }, []);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
