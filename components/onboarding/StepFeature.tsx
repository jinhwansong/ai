'use client';

import { motion } from 'framer-motion';
import { Bell, Newspaper, Sparkles, Target } from 'lucide-react';

const features = [
  { icon: Newspaper, text: '글로벌 경제 뉴스의 핵심 요약', color: 'text-(--primary)' },
  { icon: Target, text: '내가 관심 있는 섹터의 정밀 분석', color: 'text-(--primary-strong)' },
  { icon: Sparkles, text: 'AI가 찾아내는 오늘의 투자 시그널', color: 'text-amber-500' },
  { icon: Bell, text: '중요 지표 변동 실시간 알림', color: 'text-rose-500' },
];

export default function StepFeature() {
  return (
    <div className="flex flex-col gap-10 ">
      <div className="space-y-2 px-2">
        <h2 className="text-2xl font-bold text-(--text-title)">
          더 스마트한 투자를 위한<br />핵심 기능을 만나보세요
        </h2>
        <p className="text-(--text-muted) text-sm">
          당신의 시간을 아껴드리는 &apos;오늘의 시그널&apos;의 약속입니다.
        </p>
      </div>

      <div className="grid gap-4">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-5 rounded-lg bg-(--card-bg) p-6 border border-(--border)"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--light-bg) shadow-sm ${feature.color}`}>
              <feature.icon size={24} />
            </div>
            <p className="text-base font-bold text-(--text-body)">
              {feature.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

