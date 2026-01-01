'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepIntro from './StepIntro';
import StepFeature from './StepFeature';
import StepKeywords from './StepKeywords';
import StepStart from './StepStart';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import Button from '../common/Button';

const steps = [
  { id: 'intro', component: StepIntro },
  { id: 'feature', component: StepFeature },
  { id: 'keywords', component: StepKeywords },
  { id: 'start', component: StepStart },
];

export default function OnboardingSlider() {
  const [currentStep, setCurrentStep] = useState(0);
  const { keywords } = useOnboardingStore();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const ActiveStep = steps[currentStep].component;

  return (
    <div className="flex min-h-screen flex-col bg-(--background) max-w-3xl mx-auto py-9">
      {/* Top Progress Bar */}
      <div className=" flex gap-1 p-2 px-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${
              i <= currentStep ? 'bg-(--primary)' : 'bg-(--border)'
            }`}
          />
        ))}
      </div>

      {/* Main Content with Slide Animation */}
      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="h-full px-6 py-16"
          >
            <ActiveStep />
          </motion.div>
        </AnimatePresence>
        {/* Fixed Bottom Button Section */}
        {currentStep < steps.length - 1 && (
          <footer className="bg-(--background) backdrop-blur-md">
            <div className="mx-auto max-w-md">
              <Button
                full
                variant="onBoarding"
                size="lg"
                onClick={handleNext}
                disabled={currentStep === 2 && keywords.length === 0}
              >
                {currentStep === 0 ? '시작하기' : '다음으로'}
              </Button>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}

