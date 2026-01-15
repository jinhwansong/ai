'use client';
import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  Newspaper,
  LayoutGrid,
  Share2,
  CheckCircle2,
  ExternalLink,
  Search,
} from 'lucide-react';
import Tags from '@/components/common/Tags';
import { getDailyBriefingMeta } from '@/lib/utils/times';
import AnalysisSkelton from '@/components/skeleton/AnalysisSkelton';
import { useSignalDetail } from '@/hooks/useMain';
import { useAnimatedScore } from '@/hooks/useAnimatedScore';
import { useToastStore } from '@/stores/useToastStore';
import SmartParagraphs from '@/components/common/SmartParagraphs';
import ThemeToggle from '@/components/common/ThemeToggle';

export default function AnalysisClient() {
  const router = useRouter();
  const { showToast } = useToastStore();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const { data, isLoading } = useSignalDetail();
  const animatedScore = useAnimatedScore({ value: data?.sentimentScore || 0 });

  // 공유하기
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('링크가 클립보드에 복사되었습니다.');
    } catch {
      showToast('공유 실패했습니다. 다시 시도해주세요.', 'error');
    }
  };


  // 섹터 검색 (네이버 뉴스)
  const handleSectorSearch = (sectorName: string) => {
    const searchUrl = `https://search.naver.com/search.naver?ssc=tab.news.all&where=news&sm=tab_jum&query=${encodeURIComponent(
      sectorName
    )}`;
    window.open(searchUrl, '_blank');
  };

  // 뉴스 클릭 (원본 링크 또는 검색)
  const handleNewsClick = (url: string | null, title: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      // url이 없으면 네이버 뉴스 검색
      const searchUrl = `https://search.naver.com/search.naver?where=news&query=${encodeURIComponent(title)}`;
      window.open(searchUrl, '_blank');
    }
  };

  if (isLoading) {
    return <AnalysisSkelton />;
  }

  return (
    <div className="min-h-screen bg-(--background) text-(--text-body)">
      {/* 고정 상단 바 */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-(--border) px-4 glass-header">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-full p-1 hover:bg-(--secondary-bg)"
          >
            <ArrowLeft size={24} className="text-(--text-title)" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-(--text-title) dark:bg-slate-800">
            <span className="text-(--text-muted)">AI 시장 온도계</span>
            <span className="text-(--primary-strong)">{animatedScore}°C</span>
          </div>
          <ThemeToggle />
          <button
            onClick={handleShare}
            className="rounded-full p-1 hover:bg-(--secondary-bg)"
          >
            <Share2 size={20} className="text-(--text-title)" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8 bg-(--background)">
        {/* 아티클 헤더 */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-(--primary-strong)">
            <LayoutGrid size={14} />
            AI Analyst
          </div>
          <h1 className="mb-4 text-2xl font-black leading-tight text-(--text-title) md:text-3xl">
            {data?.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-(--text-muted)">
            <div className="flex items-center gap-1 font-medium">
              <Clock size={14} />
              {mounted && (
                <>
                  {getDailyBriefingMeta().date}{' '}
                  {getDailyBriefingMeta().publishTime}
                </>
              )}
            </div>
            <div className="h-3 w-px bg-(--border)" />
          </div>
        </section>

        {/* 체크포인트 */}
        <section className="mb-10">
          <div className="rounded-2xl bg-(--primary-soft) p-5 border border-(--primary)/10">
            <div className="mb-4 flex items-center gap-2 text-sm font-black text-(--primary-strong)">
              <CheckCircle2 size={18} />
              오늘의 관전 포인트
            </div>
            <ul className="space-y-3">
              {data?.checkPoints.map((point: string, idx: number) => (
                <li
                  key={idx}
                  className="flex gap-3 text-[14px] leading-relaxed font-bold text-(--text-body)"
                >
                  <span className="text-(--primary-strong)">{idx + 1}</span>
                  <p>{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 본문 내용 */}
        <section className="mb-12">
          <SmartParagraphs content={data?.content} />
          <div className="mt-8">
            <Tags tags={data?.tags || []} size={9} />
          </div>
        </section>

        <hr className="my-10 border-(--border)" />

        {/* 관련 섹터 - 즉시 검색 기능 적용 */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-(--text-title)">
                핵심 관련 섹터
              </h2>
              <p className="text-[10px] font-bold text-(--text-muted)">
                카드를 누르면 관련 뉴스를 확인합니다
              </p>
            </div>
            <Search size={18} className="text-(--text-muted) opacity-30" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {data?.relatedSectors.map((sector, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSectorSearch(sector.name)}
                className="kakao-card group relative cursor-pointer overflow-hidden p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-black text-(--text-title) group-hover:text-(--primary-strong) transition-colors">
                    {sector.name}
                  </span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      sector.status === '강세'
                        ? 'bg-(--text-rose) shadow-[0_0_8px_rgba(251,113,133,0.5)]'
                        : sector.status === '약세'
                        ? 'bg-(--text-green) shadow-[0_0_8px_rgba(74,222,128,0.5)]'
                        : 'bg-slate-400'
                    }`}
                  />
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-tighter italic">
                    Market Stance
                  </span>
                  <span
                    className={`text-xs font-black ${
                      sector.status === '강세'
                        ? 'text-(--text-rose)'
                        : sector.status === '약세'
                        ? 'text-(--text-green)'
                        : 'text-slate-500'
                    }`}
                  >
                    {sector.status}
                  </span>
                </div>
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={10} className="text-(--primary)" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 관련 뉴스 */}
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-(--text-title)">
              주요 관련 뉴스
            </h2>
            <Newspaper size={20} className="text-(--text-muted) opacity-50" />
          </div>
          <div className="space-y-3">
            {data?.relatedNews.map((news: { title: string; source: string; url: string | null; time: string }, idx) => (
              <motion.div
                key={idx}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleNewsClick(news.url, news.title)}
                className="kakao-card flex cursor-pointer items-center justify-between p-5"
              >
                <div className="flex-1 pr-4">
                  <h3 className="mb-2 line-clamp-1 text-[15px] font-bold text-(--text-title)">
                    {news.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-(--text-muted)">
                    <span>{news.source}</span>
                    <span className="h-1 w-1 rounded-full bg-(--border)" />
                    <span>{news.time}</span>
                  </div>
                </div>
                <ChevronRight
                  size={18}
                  className="text-(--text-muted) opacity-30"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 리포트 발행 정보 카드 */}
        <section className="mb-12">
          <div className="rounded-2xl border border-(--border) bg-(--secondary-bg) p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-(--card-bg)">
                <Newspaper className="h-6 w-6 text-(--primary-strong)" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-(--text-title)">
                  리포트 발행 정보
                </h3>
                <p className="text-xs font-medium text-(--text-muted)">
                  실시간 뉴스 및 시장 지표 1,200개 이상 분석
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-(--border) pt-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-tighter">
                  분석 모델
                </span>
                <p className="text-xs font-black text-(--text-title)">
                  Gemini 1.5 Flash / GPT-4o
                </p>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-tighter">
                  최종 업데이트
                </span>
                <p className="text-xs font-black text-(--text-title)">
                  {mounted ? getDailyBriefingMeta().publishTime : '--:-- --'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 하단 푸터 영역 */}
        <footer className="mt-16 rounded-3xl bg-(--light-bg) p-8 text-center border border-(--border)">
          <p className="text-[11px] font-medium leading-relaxed text-(--text-muted)">
            본 정보는 AI 모델에 의해 자동 생성된 시장 분석 자료입니다.
            <br />
            실제 투자 결정 시에는 전문가의 조언을 참고하시기 바랍니다.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="h-1 w-4 rounded-full bg-(--primary) opacity-20" />
            <div className="h-1 w-1 rounded-full bg-(--primary) opacity-20" />
            <div className="h-1 w-1 rounded-full bg-(--primary) opacity-20" />
          </div>
        </footer>
      </main>
    </div>
  );
}
