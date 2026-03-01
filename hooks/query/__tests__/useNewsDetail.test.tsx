import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useNewsDetail } from '../newsPage';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('useNewsDetail', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('fetches news detail when id is provided', async () => {
    const mockArticle = {
      id: 'test-123',
      title: 'Test Article',
      summary: 'Summary',
      content: 'Content',
      tags: [],
      published_at: '2025-01-01',
      source: 'Test',
      impact: 'High',
    };
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockArticle),
    });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useNewsDetail('test-123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockArticle);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/news/test-123'),
      expect.any(Object)
    );
  });

  it('does not fetch when id is empty', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useNewsDetail(''), { wrapper });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
