'use client';
import { RefObject } from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import Button from '../common/Button';
import { Swiper as SwiperType } from 'swiper';

const KEYWORDS = [
  '경제',
  '주식',
  '금리',
  '환율',
  '부동산',
  '산업',
  '한국시장',
  '미국시장',
];
const DEFAULT_KEYWORDS = ['경제', '주식'];

interface StepKeywordProps {
  swiperRef: RefObject<SwiperType | null>;
}

export default function StepKeywords({ swiperRef }: StepKeywordProps) {
  const { keywords, addKeyword, removeKeyword, setKeywords } =
    useOnboardingStore();

  const toggle = (kw: string) => {
    if (keywords.includes(kw)) removeKeyword(kw);
    else addKeyword(kw);
  };

  const handleNext = () => {
    if (keywords.length === 0) {
      setKeywords(DEFAULT_KEYWORDS);
    }
    swiperRef.current?.slideNext();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <h2 className="text-2xl font-bold mb-4">
        관심 있는 키워드를 선택해 주세요
      </h2>

      <p className="text-(--text-muted) text-base mb-8 leading-relaxed">
        선택하시면 더 정확한 브리핑을 만들 수 있어요.
        <br />
        원하시면 지금은 넘어가도 괜찮아요.
      </p>

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
        {KEYWORDS.map((kw) => (
          <button
            key={kw}
            onClick={() => toggle(kw)}
            className={`px-4 py-2 rounded-full border text-sm transition-all ${
              keywords.includes(kw)
                ? 'bg-(--primary) text-(--text-white) border-(--primary)'
                : 'bg-(--keyword-bg) text-(--text-body) border-(--border)'
            }`}
          >
            {kw}
          </button>
        ))}
      </div>

      <p className="text-sm text-(--text-muted-light) animate-pulse">
        선택은 나중에도 변경할 수 있어요
      </p>

      {/* 넘어가기 버튼 → default 자동 세팅 */}
      <Button variant="onBoarding" className="mt-3.5 " onClick={handleNext}>
        {keywords.length > 0 ? '선택한 키워드로 구성하기' : '그냥 넘어가기'}
      </Button>
    </div>
  );
}
