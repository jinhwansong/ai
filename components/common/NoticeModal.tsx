'use client';

import { X } from 'lucide-react';
import { ReactNode } from 'react';

type NoticeModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
};

export default function NoticeModal({
  open,
  onClose,
  title = 'AI는 참고용입니다',
  children,
}: NoticeModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-(--background) p-6 shadow-2xl border border-(--border)">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-(--text-title)">{title}</h3>
            <p className="mt-1 text-sm text-(--text-muted)">
              AI는 시장 판단을 대신하지 않습니다. 데이터 요약과 관찰 보조
              도구로만 활용해 주세요.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-(--hover-surface) text-(--text-muted)"
            aria-label="닫기"
          >
            <X size={16} />
          </button>
        </div>

        {children ? (
          <div className="mt-4 text-sm text-(--text-body)">{children}</div>
        ) : null}

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full bg-(--primary) px-4 py-2 text-sm font-bold text-(--text-white) shadow-sm hover:opacity-90"
          >
            확인하고 계속 보기
          </button>
        </div>
      </div>
    </div>
  );
}

