'use client';

import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Share2, ExternalLink, Layout, TrendingUp } from 'lucide-react';
import { useNewsDetail } from '@/hooks/useMain';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Tags from '@/components/common/Tags';
import NewsDetailSkeleton from '@/components/skeleton/NewsDetailSkeleton';
import { useToastStore } from '@/store/useToastStore';
import SmartParagraphs from '@/components/common/SmartParagraphs';

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading } = useNewsDetail(id as string);
  const { showToast } = useToastStore();

  // 공유하기
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('링크가 클립보드에 복사되었습니다.');
    } catch {
      showToast('공유 실패했습니다. 다시 시도해주세요.', 'error');
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-rose-500';
      case 'Medium':
        return 'bg-amber-500';
      default:
        return 'bg-emerald-500';
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-(--background)">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-3xl">
          {/* 상단 액션 바 */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold text-(--text-muted) hover:text-(--text-title) transition-colors"
            >
              <ArrowLeft size={18} />
              뒤로가기
            </button>
            <button
              onClick={handleShare}
              className="rounded-full p-2 text-(--text-muted) hover:bg-(--secondary-bg) transition-colors"
            >
              <Share2 size={20} />
            </button>
          </div>

          {isLoading ? (
            <NewsDetailSkeleton />
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* 헤더 정보 */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-md bg-(--secondary-bg) px-2 py-1 text-[10px] font-black text-(--text-muted) uppercase">
                    {data?.source}
                  </span>

                  <div className="flex items-center gap-1.5 rounded-full bg-(--primary-soft) px-2.5 py-0.5 ">
                    <div
                      className={`h-2 w-2 rounded-full ${getImpactColor(
                        data?.impact || 'Low'
                      )}`}
                    />
                    <span className="text-[10px] font-black text-(--primary)">
                      IMPACT: {data?.impact}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-(--text-muted)">
                    <Clock size={14} />
                    {data?.published_at &&
                      format(new Date(data?.published_at), 'yyyy.MM.dd', {
                        locale: ko,
                      })}
                  </div>
                </div>
                <h1 className="text-3xl font-black leading-tight text-(--text-title) md:text-4xl">
                  {data?.title}
                </h1>

                {/*  AI 3줄 요약 */}
                {data?.checkpoints && data.checkpoints.length > 0 && (
                  <div className="mt-6 rounded-2xl border-l-4 border-(--primary-strong) bg-blue-50/50 p-5 dark:bg-blue-900/10">
                    <h3 className="mb-3 text-sm font-black text-(--primary-strong) flex items-center gap-2">
                      <TrendingUp size={16} />
                      AI 3줄 요약
                    </h3>
                    <ul className="space-y-2">
                      {data.checkpoints.map((point: string, idx: number) => (
                        <li
                          key={idx}
                          className="flex gap-2 text-sm font-bold text-(--text-body)"
                        >
                          <span className="text-(--primary-strong)">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 본문 내용  */}
                <div className="pt-4">
                  <SmartParagraphs content={data?.content} />
                </div>
              </div>

              {/* 관련 섹터 및 태그 */}
              <div className="grid gap-8 md:grid-cols-2">
                {/* 관련 섹터 */}
                {data?.related_sectors && data.related_sectors.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-(--text-title)">
                      <Layout size={18} className="text-(--primary-strong)" />
                      <h4 className="text-sm font-bold">관련 섹터</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.related_sectors.map((sector: string) => (
                        <span
                          key={sector}
                          className="rounded-xl border border-(--border) bg-(--primary-soft) px-3 py-1.5 text-xs font-bold text-(--text-title) shadow-sm "
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 분석 키워드 */}
                {data?.tags && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-(--text-title)">
                      <TrendingUp
                        size={18}
                        className="text-(--primary-strong)"
                      />
                      <h4 className="text-sm font-bold">분석 키워드</h4>
                    </div>
                    <Tags tags={data.tags} size={10} />
                  </div>
                )}
              </div>

              {/* 원문 링크 */}
              {data?.url && (
                <div className="flex justify-center pt-8">
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-(--primary-soft) px-10 py-4 text-sm font-black text-(--primary)"
                  >
                    뉴스 원문 보기
                    <ExternalLink size={18} />
                  </a>
                </div>
              )}
            </motion.article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
