import React from 'react';
import { FutureScenario } from '@/types/briefing';

interface FutureScenarioSectionProps {
  scenarios: FutureScenario[];
  onViewDetail: (scenario: FutureScenario) => void;
}

export const FutureScenarioSection: React.FC<FutureScenarioSectionProps> = ({ scenarios, onViewDetail }) => {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
          미래 시나리오
        </h2>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
          AI Analysis
        </span>
      </div>
      <div className="space-y-4">
        {scenarios.map((scenario) => (
          <div 
            key={scenario.summary.id} 
            onClick={() => onViewDetail(scenario)}
            className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl cursor-pointer hover:shadow-indigo-500/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                scenario.summary.probability === 'high' ? 'bg-green-500' : 
                scenario.summary.probability === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}>
                {scenario.summary.probability} Probability
              </span>
              <svg className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">{scenario.summary.title}</h3>
            <p className="text-indigo-100 text-sm leading-relaxed line-clamp-2 opacity-90 mb-0">
              {scenario.detail.fullScenario}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
