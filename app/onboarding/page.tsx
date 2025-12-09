'use client';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import OnboardingKeywordList from '@/components/onboarding/OnboardingKeywordList';
import Button from '@/components/common/Button';

export default function OnboardingPage() {
  const router = useRouter();
  const { keywords, completeOnboarding } = useOnboardingStore();

  const handleStart = () => {
    completeOnboarding();
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 break-keep">
      <div className="w-full max-w-xl text-center fade-in">
        <h1 className="text-3xl md:text-4xl font-semibold text-(--text-title) ">
          관심 있는 경제 키워드를 선택하세요
        </h1>

        <p className="text-(--text-muted) mt-3 leading-relaxed text-base md:text-lg fade-up">
          선택한 키워드를 기반으로 맞춤형
          <br className="md:hidden" />
          AI 경제 리포트를 제공해요.
        </p>

        <div className="mt-10 fade-up">
          <OnboardingKeywordList />
        </div>

        <div className="flex flex-col w-full max-w-xs mx-auto mt-10 fade-up">
          <Button
            variant="primary"
            full
            disabled={keywords.length === 0}
            onClick={handleStart}
          >
            시작하기
          </Button>

          <Button
            variant="ghost"
            className="mt-3 text-sm"
            onClick={handleStart}
          >
            건너뛰기
          </Button>
        </div>
      </div>
    </div>
  );
}
