import React from 'react';
import { MarketImpact } from '@/types/briefing';

interface MarketImpactSectionProps {
  impacts: MarketImpact[];
  onViewDetail: (impact: MarketImpact) => void;
}

export const MarketImpactSection: React.FC<MarketImpactSectionProps> = ({ impacts, onViewDetail }) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
        뉴스 → 시장 영향
      </h2>
      <div className="space-y-4">
        {impacts.map((item) => (
          <div 
            key={item.summary.id} 
            onClick={() => onViewDetail(item)}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 transition-colors cursor-pointer group"
          >
            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">NEWS</span>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.summary.newsTitle}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">IMPACT ON</span>
                  <span className="text-sm font-semibold text-gray-700">{item.summary.affectedMarket}</span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg text-center font-bold ${
                item.summary.direction === 'positive' ? 'bg-red-50 text-red-600' : 
                item.summary.direction === 'negative' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
              }`}>
                {item.summary.direction.toUpperCase()}
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-start gap-3 overflow-hidden">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded mt-0.5 whitespace-nowrap">AI Logic</span>
                <div className="flex items-center gap-2 text-sm text-gray-600 truncate">
                  {item.detail.logicChain.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="truncate">{step}</span>
                      {idx < item.detail.logicChain.length - 1 && (
                        <svg className="w-3 h-3 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
