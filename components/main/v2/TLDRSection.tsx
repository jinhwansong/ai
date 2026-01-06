import React from 'react';

interface TLDRSectionProps {
  content: string;
}

export const TLDRSection: React.FC<TLDRSectionProps> = ({ content }) => {
  return (
    <section className="py-8 px-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl mb-8 border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">
          AI 요약
        </span>
        <h2 className="text-sm font-semibold text-blue-800">
          오늘의 시장 한 줄 평
        </h2>
      </div>
      <p className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
        {content}
      </p>
    </section>
  );
};

