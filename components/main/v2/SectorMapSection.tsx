import React from 'react';
import { SectorMap } from '@/types/briefing';

interface SectorMapSectionProps {
  data: SectorMap;
  onViewDetail: (data: SectorMap) => void;
}

export const SectorMapSection: React.FC<SectorMapSectionProps> = ({ data, onViewDetail }) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-green-500 rounded-full"></span>
        섹터 영향 맵
      </h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {data.summary.sectors.map((sector) => (
            <div 
              key={sector.name}
              className={`p-4 rounded-xl flex flex-col items-center justify-center text-center ${
                sector.performance > 0 ? 'bg-red-50' : 'bg-blue-50'
              }`}
            >
              <span className="text-sm font-medium text-gray-600 mb-1">{sector.name}</span>
              <span className={`text-xl font-bold ${
                sector.performance > 0 ? 'text-red-600' : 'text-blue-600'
              }`}>
                {sector.performance > 0 ? '+' : ''}{sector.performance}%
              </span>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-bold text-gray-900">AI 요약: </span>
            {data.detail.analysis}
          </p>
        </div>
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => onViewDetail(data)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            섹터별 상세 분석 보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
