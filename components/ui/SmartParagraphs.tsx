'use client';

import React from 'react';

interface SmartParagraphsProps {
  content?: string;
  sentencesPerParagraph?: number;
  className?: string;
}

/**
 * 텍스트를 문장 단위로 나누고, 일정 문장 수마다 문단을 구분하여 렌더링하는 컴포넌트
 */
const SmartParagraphs = ({
  content,
  sentencesPerParagraph = 3,
  className = "text-lg leading-[1.8] text-(--text-body) font-medium",
}: SmartParagraphsProps) => {
  if (!content) return null;

  // 문장 단위로 분리 (마침표+공백 기준)
  const sentences = content.split(/(?<=\. )/);
  
  // 문장들을 묶어서 문단 생성
  const paragraphs = sentences.reduce((acc: string[][], sentence, idx) => {
    const chunkIndex = Math.floor(idx / sentencesPerParagraph);
    if (!acc[chunkIndex]) acc[chunkIndex] = [];
    acc[chunkIndex].push(sentence);
    return acc;
  }, []);

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, pIdx) => (
        <p key={pIdx} className={className}>
          {paragraph.join(' ')}
        </p>
      ))}
    </div>
  );
};

export default SmartParagraphs;
