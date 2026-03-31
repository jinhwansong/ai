import type { MarketStance } from '@/types/main';

const STANCES: readonly MarketStance[] = [
  'positive',
  'negative',
  'neutral',
  'cautious',
];

/** 파이프라인·API 공통: 등락률(%) → 스탠스 (briefing `macro`와 동일 규칙) */
export function macroStanceFromChangePercent(changePercent: number): MarketStance {
  if (changePercent > 0.5) return 'positive';
  if (changePercent < -0.5) return 'negative';
  if (changePercent < 0) return 'cautious';
  return 'neutral';
}

export function coerceMarketStance(value: string | undefined): MarketStance | null {
  if (!value) return null;
  return STANCES.includes(value as MarketStance) ? (value as MarketStance) : null;
}

/** 글로벌 매크로 카드 — 상태 뱃지 라벨·색 (GlobalMacro 등) */
export const MACRO_STATUS_META: Record<
  MarketStance,
  { label: string; color: string }
> = {
  positive: {
    label: '호재',
    color: 'bg-(--bg-rose) text-(--text-rose)',
  },
  negative: {
    label: '악재',
    color: 'bg-(--bg-blue) text-(--text-blue)',
  },
  cautious: {
    label: '유의',
    color: 'bg-(--bg-amber) text-(--text-amber)',
  },
  neutral: {
    label: '관망',
    color: 'bg-(--secondary-bg) text-(--text-muted)',
  },
};

export function getMacroStatusMeta(status: MarketStance) {
  return MACRO_STATUS_META[status] ?? MACRO_STATUS_META.neutral;
}
