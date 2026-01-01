'use client';

import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '../common/Button';
import { fetchBriefing } from '@/lib/api/briefing';

export default function StepStart() {
  const { keywords, completeOnboarding } = useOnboardingStore();
  const router = useRouter();

  const handleFinish = async() => {
    completeOnboarding();
    fetchBriefing(keywords);
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 pt-10 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative"
      >
        <div className="absolute -inset-10 rounded-full bg-(--primary-soft) blur-3xl opacity-50" />
        <Image
          src="/onboarding4.png"
          width={260}
          height={260}
          alt="완료"
          className="relative drop-shadow-2xl"
        />
      </motion.div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-(--text-title) leading-tight">
          준비가 완료되었습니다!
        </h2>
        <p className="text-(--text-muted) text-lg">
          {keywords.length > 0 
            ? `${keywords.join(', ')} 분야를 중심으로 최적의 분석 리포트를 준비했어요.`
            : '지금 바로 실시간 시장 분석을 시작해보세요.'}
        </p>
      </div>

      <Button
        full
        variant="onBoarding"
        size="xl"
        onClick={handleFinish}
        className="mt-10 max-w-md"
      >
        분석 리포트 확인하기
      </Button>
    </div>
  );
}

