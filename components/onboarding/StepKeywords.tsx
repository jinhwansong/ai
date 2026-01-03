'use client';

import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  BarChart3,
  Landmark, 
  Globe2, 
  Cpu,
  BatteryCharging,
  Dna,
  Smartphone,
  Home,
  Container,
  Coins,
  ShoppingBag,
  Check
} from 'lucide-react';

const SECTOR_OPTIONS = [
  {  name: '국내증시', icon: LineChart, color: 'text-rose-500', emoji: '🇰🇷' },
  { name: '미국증시', icon: BarChart3, color: 'text-blue-500', emoji: '🇺🇸' },
  {  name: '금리/채권', icon: Landmark, color: 'text-amber-600', emoji: '🏦' },
  {  name: '환율', icon: Globe2, color: 'text-emerald-500', emoji: '💵' },
  {  name: '반도체/AI', icon: Cpu, color: 'text-violet-500', emoji: '🧠' },
  {  name: '이차전지', icon: BatteryCharging, color: 'text-green-500', emoji: '🔋' },
  { name: '바이오', icon: Dna, color: 'text-pink-500', emoji: '🧬' },
  {  name: '빅테크', icon: Smartphone, color: 'text-slate-700', emoji: '📱' },
  {  name: '부동산', icon: Home, color: 'text-orange-500', emoji: '🏠' },
  {  name: '원자재', icon: Container, color: 'text-yellow-700', emoji: '📦' },
  {  name: '가상자산', icon: Coins, color: 'text-yellow-500', emoji: '🪙' },
  {  name: '소비재', icon: ShoppingBag, color: 'text-purple-500', emoji: '🛍️' },
];

export default function StepKeywords() {
  const { keywords, addKeyword, removeKeyword } = useOnboardingStore();

  const toggle = (id: string) => {
    if (keywords.includes(id)) {
      removeKeyword(id);
    } else {
      addKeyword(id);
    }
  };
  console.log(keywords);
  return (
    <div className="flex flex-col gap-8 ">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-(--text-title)">
          어떤 분야에
          <br />
          관심이 있으신가요?
        </h2>
        <p className="text-(--text-muted) text-sm">
          관심 있는 섹터를 선택해 주세요. (최대 4개)
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3  gap-4">
        {SECTOR_OPTIONS.map((sector) => {
          const isSelected = keywords.includes(sector.name);
          const isMaxReached = keywords.length >= 4;
          const Icon = sector.icon;

          return (
            <motion.button
              key={sector.name}
              whileTap={!isSelected && isMaxReached ? {} : { scale: 0.98 }}
              onClick={() => toggle(sector.name)}
              disabled={!isSelected && isMaxReached}
              animate={{
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                opacity: !isSelected && isMaxReached ? 0.5 : 1,
              }}
              className={`relative flex items-center gap-4 rounded-lg p-6 text-left bg-(--card-bg) border border-(--border) transition-all duration-300 ${
                isSelected
                  ? 'bg-white shadow-xl z-10'
                  : 'bg-white border-(--border) shadow-sm'
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-(--bg-main) ${sector.color}`}
              >
                <Icon size={24} strokeWidth={2.5} />
              </div>

              <div className="space-y-1">
                <p
                  className={`text-sm font-bold ${
                    isSelected ? 'text-(--primary)' : 'text-(--text-title)'
                  }`}
                >
                  {sector.name}
                </p>
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-(--primary) border-4 border-white shadow-md"
                  >
                    <Check size={14} strokeWidth={4} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* 하단 가이드 문구 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center"
      >
        <p className="text-sm font-medium text-(--text-body)">
          현재{' '}
          <span className="font-bold text-(--primary)">
            {keywords.length}개
          </span>
          의 관심 분야를 선택했어요
        </p>
      </motion.div>
    </div>
  );
}
