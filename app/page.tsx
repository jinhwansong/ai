'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import SignalHighlight from '@/components/main/SignalHighlight';
import GlobalMacro, { GlobalMacroItem } from '@/components/main/GlobalMacro';
import SectorStrategy from '@/components/main/SectorStrategy';
import NewsFeed, { NewsItem } from '@/components/main/NewsFeed';
import Portfolio from '@/components/main/Portfolio';
import Spinner from '@/components/common/Spinner';

const signalData = {
  focus: 'EV 인프라 확장 및 AI 운행 최적화',
  description:
    '카카오 T 전기차 비중이 서울 지역 내 32%를 돌파하며 에너지 네트워크와 연계된 스마트 모빌리티 수요가 폭발적으로 증가하고 있습니다.',
  value: '98.4',
  change: '+4.2%',
  tags: ['EV 인프라', 'AI Dispatch', '스마트시티', '탄소중립'],
};

const globalMacroData: GlobalMacroItem[] = [
  {
    region: '한국',
    indexName: 'KOSPI',
    value: '2,584.22',
    change: '+0.45%',
    status: 'positive',
  },
  {
    region: '미국',
    indexName: 'S&P 500',
    value: '5,815.03',
    change: '-0.12%',
    status: 'neutral',
  },
  {
    region: '일본',
    indexName: 'Nikkei 225',
    value: '38,911.50',
    change: '+1.10%',
    status: 'positive',
  },
  {
    region: '유럽',
    indexName: 'Euro Stoxx 50',
    value: '4,912.45',
    change: '-0.85%',
    status: 'negative',
  },
];

const sectorStrategies = [
  {
    name: '모빌리티 플랫폼',
    signal: 'BUY',
    focus: '구독형 서비스 가입자 20% 증가',
    momentum: 'Strong',
  },
  {
    name: '에너지 솔루션',
    signal: 'BUY',
    focus: '초급속 충전 네트워크 전국 확대',
    momentum: 'Strong',
  },
  {
    name: '자율주행 R&D',
    signal: 'HOLD',
    focus: '기술 고도화 단계 진입',
    momentum: 'Moderate',
  },
];

const newsItems: NewsItem[] = [
  {
    title: '카카오 T, 자율주행 택시 시범 운행 구역 확대',
    summary:
      '판교를 넘어 강남권 주요 거점으로 서비스 영역을 넓히며 데이터 수집 가속화.',
    time: '방금 전',
    impact: 'High',
  },
  {
    title: '전국 충전소 통합 연동 서비스 정식 출시',
    summary:
      '민간/공공 충전기 90% 이상을 하나의 앱으로 결제 가능한 에코 시스템 구축.',
    time: '12분 전',
    impact: 'Medium',
  },
  {
    title: '분기 영업이익 역대 최대치 경신 전망',
    summary:
      '플랫폼 효율화와 신규 비즈니스 모델 안착으로 수익성 지표 대폭 개선.',
    time: '45분 전',
    impact: 'High',
  },
];

const portfolioData = {
  performance: [
    { label: '연간 수익률', value: '24.8%', delta: '+5.2%' },
    { label: '위험 조정 지수', value: '1.84', delta: '+0.12' },
    { label: '데이터 반영도', value: '96%', delta: 'Optimal' },
  ],
  holdings: [
    { name: 'Mobility Tech', ratio: '42%', change: '+2.4%' },
    { name: 'Energy Infra', ratio: '28%', change: '+1.8%' },
    { name: 'AI Software', ratio: '18%', change: '+3.1%' },
    { name: 'Global Logistics', ratio: '12%', change: '-0.5%' },
  ],
};

export default function Home() {
  const router = useRouter();
  const {completed,hasHydrated} = useOnboardingStore((state) => state);

  useEffect(() => {
    if (hasHydrated && !completed) {
      router.replace('/onboarding');
    }
  }, [hasHydrated, completed, router]);

  if (!hasHydrated || !completed) return <Spinner/>;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl space-y-8 pb-20">
          <SignalHighlight signal={signalData} />

          <GlobalMacro data={globalMacroData} />

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-8">
              <SectorStrategy sectors={sectorStrategies} />
              <Portfolio
                performance={portfolioData.performance}
                holdings={portfolioData.holdings}
              />
            </div>

            <div className="space-y-8">
              <NewsFeed news={newsItems} />
              <div className="kakao-card bg-linear-to-br from-slate-800 to-slate-900 p-6 text-white">
                <h4 className="text-sm font-black uppercase tracking-widest opacity-60">
                  Insight Card
                </h4>
                <p className="mt-4 text-lg font-bold">
                  &quot;현재 EV 인프라 관련 섹터의 모멘텀이 과거 3개년 평균 대비
                  2.4배 수준입니다.&quot;
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="h-1 w-12 rounded-full bg-indigo-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-60">
                    AI Analyst Bot
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
