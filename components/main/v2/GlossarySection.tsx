import React from 'react';
import { GlossaryTerm } from '@/types/briefing';

interface GlossarySectionProps {
  terms: GlossaryTerm[];
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ terms }) => {
  return (
    <section className="mb-20 pt-10 border-t border-gray-100">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        경제 용어 돋보기
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {terms.map((term) => (
          <div key={term.term} className="group">
            <dt className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {term.term}
            </dt>
            <dd className="text-sm text-gray-500 leading-relaxed">
              {term.definition}
            </dd>
          </div>
        ))}
      </div>
    </section>
  );
};

