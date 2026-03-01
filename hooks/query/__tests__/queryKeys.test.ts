import { describe, it, expect } from 'vitest';
import { mainQueryKeys } from '../queryKeys';

describe('mainQueryKeys', () => {
  it('returns stable keys for main endpoints', () => {
    expect(mainQueryKeys.signal).toEqual(['main-signal']);
    expect(mainQueryKeys.macro).toEqual(['main-macro']);
    expect(mainQueryKeys.sector).toEqual(['main-sector']);
    expect(mainQueryKeys.news).toEqual(['main-news']);
    expect(mainQueryKeys.observation).toEqual(['main-observation']);
    expect(mainQueryKeys.insight).toEqual(['main-insight']);
  });

  it('newsList key includes filters', () => {
    const key = mainQueryKeys.newsList({
      sort: 'latest',
      category: 'all',
      period: 'week',
    });
    expect(key).toEqual([
      'news-list',
      { sort: 'latest', category: 'all', period: 'week' },
    ]);
  });

  it('newsDetail key includes id', () => {
    expect(mainQueryKeys.newsDetail('abc-123')).toEqual(['news-detail', 'abc-123']);
  });

  it('search key includes query', () => {
    expect(mainQueryKeys.search('nvidia')).toEqual(['search', 'nvidia']);
  });
});
