'use client';

import { AlertCircle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import type { MarketStance } from '@/types/main';

const ICON_PROPS = { size: 10 as const, strokeWidth: 3 as const };

/** Lucide 아이콘은 constants(.ts)에 두지 않고, 상태→아이콘만 switch로 매핑 */
export function MacroStatusGlyph({ status }: { status: MarketStance }) {
  switch (status) {
    case 'positive':
      return <CheckCircle2 {...ICON_PROPS} />;
    case 'negative':
      return <XCircle {...ICON_PROPS} />;
    case 'cautious':
      return <AlertCircle {...ICON_PROPS} />;
    case 'neutral':
    default:
      return <HelpCircle {...ICON_PROPS} />;
  }
}
