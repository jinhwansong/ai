'use client';

import React, { useState } from 'react';
import { TLDRSection } from '@/components/main/v2/TLDRSection';
import { HotTopicSection } from '@/components/main/v2/HotTopicSection';
import { SectorMapSection } from '@/components/main/v2/SectorMapSection';
import { MarketImpactSection } from '@/components/main/v2/MarketImpactSection';
import { GlobalIndicesSection } from '@/components/main/v2/GlobalIndicesSection';
import { FutureScenarioSection } from '@/components/main/v2/FutureScenarioSection';
import { GlossarySection } from '@/components/main/v2/GlossarySection';
import { DetailOverlay } from '@/components/main/v2/DetailOverlay';
import { DUMMY_BRIEFING } from '@/lib/api/dummyBriefing';
import { HotTopic, SectorMap, MarketImpact, FutureScenario } from '@/types/briefing_v2';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

type DetailView = 
  | { type: 'hot-topic', data: HotTopic }
  | { type: 'sector-map', data: SectorMap }
  | { type: 'market-impact', data: MarketImpact }
  | { type: 'future-scenario', data: FutureScenario }
  | null;

export default function MainPageV2() {
  const briefing = DUMMY_BRIEFING;
  const [detailView, setDetailView] = useState<DetailView>(null);

  const closeDetail = () => setDetailView(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="grow container mx-auto px-4 max-w-4xl py-6">
        {/* Update Time Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-gray-500">브리핑 스냅샷</span>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(briefing.createdAt).toLocaleString('ko-KR', { 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })} 업데이트
          </span>
        </div>

        {/* 1. AI 한 줄 요약 (TL;DR) */}
        <TLDRSection content={briefing.tldr} />

        {/* 2. 오늘의 핫 토픽 */}
        <HotTopicSection 
          topics={briefing.hotTopics} 
          onViewDetail={(data) => setDetailView({ type: 'hot-topic', data })}
        />

        {/* 3. 관련 섹터 맵 (Heatmap) */}
        <SectorMapSection 
          data={briefing.sectorMap} 
          onViewDetail={(data) => setDetailView({ type: 'sector-map', data })}
        />

        {/* 4. 뉴스 -> 시장 영향 구조 설명 */}
        <MarketImpactSection 
          impacts={briefing.marketImpact} 
          onViewDetail={(data) => setDetailView({ type: 'market-impact', data })}
        />

        {/* 5. 글로벌 지수 요약 */}
        <GlobalIndicesSection indices={briefing.globalIndices} />

        {/* 6. 미래 시나리오 (AI Analysis) */}
        <FutureScenarioSection 
          scenarios={briefing.futureScenarios} 
          onViewDetail={(data) => setDetailView({ type: 'future-scenario', data })}
        />

        {/* AI Disclaimer Section */}
        <div className="my-12 p-6 bg-amber-50 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-sm font-bold text-amber-800">이용 안내</h3>
          </div>
          <p className="text-xs text-amber-700 leading-relaxed">
            본 서비스에서 제공하는 모든 분석과 시나리오는 AI가 뉴스 및 지표 데이터를 바탕으로 생성한 참고용 정보입니다. 
            AI 분석은 100% 정확성을 보장하지 않으며, 투자 판단의 근거로 사용될 수 없습니다. 
            최종적인 투자 결정과 책임은 사용자 본인에게 있습니다.
          </p>
        </div>

        {/* 7. 경제 용어 돋보기 */}
        <GlossarySection terms={briefing.glossary} />
      </main>

      <Footer />

      {/* Detail Overlay */}
      <DetailOverlay
        isOpen={detailView !== null}
        onClose={closeDetail}
        title={
          detailView?.type === 'hot-topic' ? detailView.data.summary.title :
          detailView?.type === 'sector-map' ? '섹터 영향 상세 분석' :
          detailView?.type === 'market-impact' ? detailView.data.summary.newsTitle :
          detailView?.type === 'future-scenario' ? detailView.data.summary.title : ''
        }
        tag={
          detailView?.type === 'hot-topic' ? detailView.data.summary.tag :
          detailView?.type === 'sector-map' ? '섹터 리포트' :
          detailView?.type === 'market-impact' ? '시장 영향' :
          detailView?.type === 'future-scenario' ? 'AI 시나리오' : ''
        }
      >
        {detailView?.type === 'hot-topic' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">설명</h4>
              <p className="text-gray-700 leading-relaxed">{detailView.data.detail.description}</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">관련 뉴스</h4>
              <ul className="space-y-2">
                {detailView.data.detail.relatedNews.map((news, i) => (
                  <li key={i}>
                    <a href={news.url} className="text-blue-600 hover:underline text-sm flex items-center gap-2">
                      <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                      [{news.source}] {news.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">AI</span>
                분석 결과
              </h4>
              <p className="text-sm text-blue-900 leading-relaxed">{detailView.data.detail.aiAnalysis}</p>
              <div className="mt-4 pt-3 border-t border-blue-100 text-xs text-blue-600/70 italic">
                주의: {detailView.data.detail.caveat}
              </div>
            </div>
          </div>
        )}

        {detailView?.type === 'sector-map' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-red-800 mb-2 uppercase tracking-tight">강세 섹터</h4>
                <ul className="space-y-1">
                  {detailView.data.detail.topPerformers.map((s, i) => (
                    <li key={i} className="text-sm text-red-700 font-medium">• {s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-tight">약세 섹터</h4>
                <ul className="space-y-1">
                  {detailView.data.detail.bottomPerformers.map((s, i) => (
                    <li key={i} className="text-sm text-blue-700 font-medium">• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h4 className="text-sm font-bold text-gray-900 mb-2">상세 분석</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{detailView.data.detail.analysis}</p>
            </div>
          </div>
        )}

        {detailView?.type === 'market-impact' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">근거 데이터 (Evidence)</h4>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
                {detailView.data.detail.evidence}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">인과 관계 (Logic Chain)</h4>
              <div className="space-y-4 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                {detailView.data.detail.logicChain.map((step, i) => (
                  <div key={i} className="flex items-start gap-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center text-[10px] font-bold text-indigo-500">
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
              <h4 className="text-sm font-bold text-indigo-800 mb-2 flex items-center gap-2">
                <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded">AI</span>
                시장 전망 의견
              </h4>
              <p className="text-sm text-indigo-900 leading-relaxed">{detailView.data.detail.aiOpinion}</p>
            </div>
          </div>
        )}

        {detailView?.type === 'future-scenario' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                detailView.data.summary.probability === 'high' ? 'bg-green-100 text-green-700' : 
                detailView.data.summary.probability === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {detailView.data.summary.probability} Probability
              </span>
            </div>
            <p className="text-gray-900 font-medium text-lg leading-relaxed">
              {detailView.data.detail.fullScenario}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">필수 전제 조건</h4>
                <ul className="space-y-2">
                  {detailView.data.detail.preconditions.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-red-500 uppercase mb-3 tracking-widest">주요 리스크 요인</h4>
                <ul className="space-y-2">
                  {detailView.data.detail.riskFactors.map((item, idx) => (
                    <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 bg-red-400 rounded-full shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 mt-8">
              <h4 className="text-sm font-bold text-indigo-800 mb-2">AI 모델 분석 근거</h4>
              <p className="text-xs text-indigo-900/70 leading-relaxed">
                현재 지표 데이터(P/E Ratio, 장단기 금리차, 실업률 등)를 종합하여 확률 기반 모델링을 수행한 결과입니다. 
                {detailView.data.detail.aiDisclaimer}
              </p>
            </div>
          </div>
        )}
      </DetailOverlay>
    </div>
  );
}

