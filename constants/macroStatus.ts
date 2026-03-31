import type { MarketStance } from '@/types/main';

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
