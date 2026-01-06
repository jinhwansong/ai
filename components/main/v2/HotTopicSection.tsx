import React from 'react';
import { HotTopic } from '@/types/briefing';

interface HotTopicSectionProps {
  topics: HotTopic[];
  onViewDetail: (topic: HotTopic) => void;
}

export const HotTopicSection: React.FC<HotTopicSectionProps> = ({ topics, onViewDetail }) => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-red-500 rounded-full"></span>
        오늘의 핫 토픽
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {topics.map((topic) => (
          <div 
            key={topic.summary.id}
            onClick={() => onViewDetail(topic)}
            className="p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white group"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                {topic.summary.tag}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">중요도</span>
                <span className="text-sm font-bold text-red-500">{topic.summary.impactScore}</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{topic.summary.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {topic.detail.description}
            </p>
            <div className="mt-4 flex justify-end">
              <span className="text-blue-600 text-sm font-semibold flex items-center gap-1">
                상세보기
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
