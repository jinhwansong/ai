'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useSearchNews, useSummary } from '@/query/useReport';
import { fetchTranslateNews } from '@/lib/fetchReport';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim();

  const {
    data: newsData,
    isLoading: newsLoading,
    error: newsError,
  } = useSearchNews(q);
  const articles = useMemo(() => newsData?.articles ?? [], [newsData?.articles]);

  const [showKoreanNews, setShowKoreanNews] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [translatedMap, setTranslatedMap] = useState<
    Record<string, { koTitle: string; koDescription: string }>
  >({});

  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useSummary(q, articles);

  // 기사 목록 한글 번역(옵션)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!showKoreanNews) return;
      if (!articles || articles.length === 0) return;

      // 이미 번역된 경우(첫번째 기사 기준)면 재호출 방지
      const firstUrl = articles[0]?.url;
      if (firstUrl && translatedMap[firstUrl]) return;

      setTranslateError(null);
      setTranslateLoading(true);
      try {
        const res = await fetchTranslateNews(articles.slice(0, 8));
        if (cancelled) return;
        const map: Record<string, { koTitle: string; koDescription: string }> =
          {};
        for (const it of res.items ?? []) {
          if (!it?.url) continue;
          map[it.url] = {
            koTitle: it.koTitle ?? '',
            koDescription: it.koDescription ?? '',
          };
        }
        setTranslatedMap(map);
      } catch (e) {
        if (cancelled) return;
        setTranslateError(e instanceof Error ? e.message : '번역 실패');
      } finally {
        if (!cancelled) setTranslateLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showKoreanNews, articles]);

  return (
    <div className="px-5 py-8">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="text-sm text-(--text-muted) hover:underline">
          ← 홈으로
        </Link>
        <Link
          href="/onboarding"
          className="text-sm font-medium text-(--primary) hover:underline"
        >
          키워드 설정
        </Link>
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-semibold tracking-tight text-(--text-title)">
          {q ? `“${q}” 브리핑` : '키워드를 입력해 주세요'}
        </h1>
        {q && (
          <p className="text-sm text-(--text-muted) mt-1">
            관련 뉴스와 AI 요약 인사이트를 함께 제공합니다.
          </p>
        )}
      </div>

      {!q && (
        <div className="mt-6 p-5 rounded-xl border border-(--border) bg-(--card-bg)">
          <p className="text-(--text-body)">
            검색창에서 키워드를 입력하거나, 홈의 키워드 칩을 클릭해 주세요.
          </p>
        </div>
      )}

      {q && (
        <div className="mt-8 grid gap-8">
          {/* AI 요약 */}
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-lg font-semibold text-(--text-title)">
                AI 인사이트
              </h2>
              {(summaryLoading || newsLoading) && (
                <span className="text-xs text-(--text-muted)">
                  생성 중…
                </span>
              )}
            </div>

            {newsError && (
              <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
                <p className="text-(--text-body)">
                  뉴스 검색에 실패했습니다. 잠시 후 다시 시도해 주세요.
                </p>
                <p className="text-xs text-(--text-muted) mt-2">
                  {newsError instanceof Error ? newsError.message : ''}
                </p>
              </div>
            )}

            {!newsError && summaryError && (
              <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
                <p className="text-(--text-body)">
                  요약 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.
                </p>
              </div>
            )}

            {!newsError &&
              !newsLoading &&
              newsData &&
              newsData.articles.length === 0 && (
                <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
                  <p className="text-(--text-body)">
                    관련 뉴스가 0건이라 AI 인사이트를 생성할 수 없습니다.
                  </p>
                  <p className="text-sm text-(--text-muted) mt-2">
                    다른 키워드로 검색해 보세요.
                  </p>
                </div>
              )}

            {!summaryLoading &&
              !summaryError &&
              summaryData?.insights?.map((it, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-(--border) bg-(--card-bg) shadow-sm"
                >
                  <h3 className="text-base font-semibold text-(--text-title)">
                    {it.title}
                  </h3>
                  <p className="text-(--text-body) mt-2 whitespace-pre-line">
                    {it.summary}
                  </p>
                  <div className="mt-4 p-4 rounded-lg bg-(--primary-sub)">
                    <p className="text-sm font-medium text-(--text-title)">
                      시장 영향
                    </p>
                    <p className="text-(--text-body) mt-1 whitespace-pre-line">
                      {it.marketImpact}
                    </p>
                  </div>
                </div>
              ))}

            {!summaryLoading &&
              !summaryError &&
              summaryData &&
              (!summaryData.insights || summaryData.insights.length === 0) && (
                <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
                  <p className="text-(--text-body)">
                    아직 인사이트가 없습니다.
                  </p>
                </div>
              )}
          </section>

          {/* 뉴스 목록 */}
          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <h2 className="text-lg font-semibold text-(--text-title)">
                관련 뉴스
              </h2>
              <div className="flex items-center gap-3">
                {newsData && (
                  <span className="text-xs text-(--text-muted)">
                    {newsData.total}건
                  </span>
                )}
                <label className="flex items-center gap-2 text-xs text-(--text-muted) select-none">
                  <input
                    type="checkbox"
                    className="accent-(--primary)"
                    checked={showKoreanNews}
                    onChange={(e) => setShowKoreanNews(e.target.checked)}
                    disabled={newsLoading || !!newsError}
                  />
                  한글로 보기
                </label>
              </div>
            </div>

            {newsLoading && (
              <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
                <p className="text-(--text-muted)">불러오는 중…</p>
              </div>
            )}

            {showKoreanNews && translateLoading && (
              <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
                <p className="text-(--text-muted)">기사 번역 중…</p>
              </div>
            )}

            {showKoreanNews && translateError && (
              <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
                <p className="text-(--text-body)">
                  기사 번역에 실패했습니다.
                </p>
                <p className="text-xs text-(--text-muted) mt-2">{translateError}</p>
              </div>
            )}

            {!newsLoading && newsData && newsData.articles.length === 0 && (
              <div className="p-5 rounded-xl border border-(--border) bg-(--card-bg)">
                <p className="text-(--text-body)">
                  {newsData.message ?? '해외 뉴스 기준으로 검색 결과가 없습니다'}
                </p>
              </div>
            )}

            <div className="grid gap-3">
              {newsData?.articles?.map((a) => (
                <a
                  key={a.url}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-xl border border-(--border) bg-(--card-bg) hover:bg-(--hover-surface) transition-colors"
                >
                  <p className="text-sm text-(--text-muted)">
                    {a.source?.name}
                  </p>
                  <p className="text-(--text-title) font-medium mt-1">
                    {showKoreanNews && translatedMap[a.url]?.koTitle
                      ? translatedMap[a.url]?.koTitle
                      : a.title}
                  </p>
                  {(showKoreanNews
                    ? translatedMap[a.url]?.koDescription || a.description
                    : a.description) && (
                    <p className="text-(--text-body) mt-2 line-clamp-3">
                      {showKoreanNews
                        ? translatedMap[a.url]?.koDescription || a.description
                        : a.description}
                    </p>
                  )}
                </a>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
