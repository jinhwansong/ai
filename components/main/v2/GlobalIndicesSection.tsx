import React from 'react';
import { GlobalIndex } from '@/types/briefing';

interface GlobalIndicesSectionProps {
  indices: GlobalIndex[];
}

export const GlobalIndicesSection: React.FC<GlobalIndicesSectionProps> = ({ indices }) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
        글로벌 지수 요약
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {indices.map((index) => (
          <div key={index.name} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="text-xs font-semibold text-gray-500 mb-1">{index.name}</div>
            <div className="text-lg font-bold text-gray-900">{index.value}</div>
            <div className={`text-sm font-medium ${
              index.change.startsWith('+') ? 'text-red-500' : 'text-blue-500'
            }`}>
              {index.change} ({index.changePercent})
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

