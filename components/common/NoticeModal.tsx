'use client';

import { usePushNotification } from '@/hooks/usePushNotification';
import { useShowNotice } from '@/stores/useShowNotice';
import { ReactNode, useEffect, useState } from 'react';
import Button from './Button';
import { useMountedStore } from '@/stores/useMountedStore';

type NoticeModalProps = {
  title?: string;
  children?: ReactNode;
};

export default function NoticeModal({
  title = 'AI는 참고용입니다',
  children,
}: NoticeModalProps) {
  const { isDismissed, onClose } = useShowNotice();
  const { mounted, setMounted } = useMountedStore();
  
  const { isSubscribed, subscribe, isLoading } = usePushNotification();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubscribeAndClose = async () => {
    await subscribe(); 
    onClose();
  };

  useEffect(() => {
    // 하이드레이션 완료 후에만 body 스크롤 제어
    if (mounted && !isDismissed) {
      if (typeof window !== 'undefined') {
        const isCoarse =
          window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
        if (isCoarse) window.scrollTo({ top: 0, left: 0 });
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDismissed, mounted]);

  if (!mounted || isDismissed) return null;

  if (typeof document === 'undefined') return null;
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
        </div>

        {children ? (
          <div className="mt-4 text-sm text-(--text-body)">{children}</div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            알림 없이 그냥 보기
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubscribeAndClose}
            disabled={isLoading || isSubscribed}
          >
            {isSubscribed ? '이미 구독 중입니다' : '알림 받고 리포트 보기'}
          </Button>
        </div>
      </div>
    </div>
  );
}

