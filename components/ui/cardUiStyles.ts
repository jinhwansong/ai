import type { SectorStance } from '@/types/main';

/** 뉴스 impact 점 — 메인 피드·뉴스 카드 공통 */
export function impactLevelDotClass(impact: string): string {
  if (impact === 'High') return 'bg-(--text-rose)';
  if (impact === 'Medium') return 'bg-(--text-amber)';
  return 'bg-(--text-green)';
}

/** 섹터 전략 스탠스 옆 점 */
export function sectorStanceDotClass(stance: SectorStance): string {
  const base = 'h-2 w-2 shrink-0 rounded-full';
  let color: string;
  switch (stance) {
    case 'POSITIVE':
      color = 'bg-(--text-rose)';
      break;
    case 'NEUTRAL':
      color = 'bg-(--text-green)';
      break;
    case 'NEGATIVE':
      color = 'bg-slate-500';
      break;
    case 'WATCHING':
      color = 'bg-(--text-amber)';
      break;
    default:
      color = 'bg-slate-400';
  }
  return `${base} ${color}`;
}

/** 관찰 포인트 모멘텀 뱃지 */
export function observationMomentumPillClass(momentum: string): string {
  const base =
    'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black';
  if (momentum === 'Strong') return `${base} bg-(--bg-rose) text-(--text-rose)`;
  if (momentum === 'Moderate')
    return `${base} bg-(--bg-amber) text-(--text-amber)`;
  return `${base} bg-(--bg-blue) text-(--text-blue)`;
}
