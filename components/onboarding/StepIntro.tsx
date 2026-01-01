'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function StepIntro() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 text-center">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <div className="absolute -inset-4 rounded-full bg-(--primary-soft) blur-2xl" />
        <Image
          src="/onboarding1.png"
          width={240}
          height={240}
          alt="온보딩"
          className="relative drop-shadow-2xl"
        />
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold leading-tight text-(--text-title)">
          데이터와 AI가 찾는<br />최적의 투자 시그널
        </h1>
        <p className="text-(--text-muted) text-lg">
          넘쳐나는 뉴스 속에서<br />
          지금 당신에게 꼭 필요한 정보만 읽어드려요.
        </p>
      </div>
    </div>
  );
}

