'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

const DEFAULT_KEYWORDS = ['경제', '주식'];

export default function StepStart() {
  const { keywords, setKeywords, completeOnboarding } = useOnboardingStore();

  useEffect(() => {
    if (keywords.length === 0) {
      setKeywords(DEFAULT_KEYWORDS);
    }
  }, [setKeywords, keywords.length]);

  const handleStart = () => {
    completeOnboarding();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <Image
        src="/onboarding4.png"
        width={210}
        height={210}
        alt="온보딩"
        className="mb-5"
      />

      <h1 className="text-3xl font-bold mb-4">
        이제, 나만의 브리핑을 시작해볼까요
      </h1>

      <p className="text-gray-500 mb-10">
        {keywords.length === 0
          ? '선택하신 내용이 없어 기본 추천으로 구성했어요.'
          : '선택하신 관심사 기준으로 브리핑을 준비했어요.'}
      </p>

      <Link
        href="/"
        onClick={handleStart}
        className="w-full max-w-sm py-3  bg-(--primary) text-(--text-white)  font-semibold rounded-lg text-sm"
      >
        시작하기
      </Link>
    </div>
  );
}
