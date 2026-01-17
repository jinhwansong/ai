'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

// 초기 설치 상태를 계산하는 함수
function getInitialInstalledState(): boolean {
  if (typeof window === 'undefined') return false;

  // Standalone 모드로 실행 중인지 확인
  const isStandalone = window.matchMedia(
    '(display-mode: standalone)'
  ).matches;

  // iOS Safari의 navigator.standalone 확인
  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;
  const isIOSStandalone = navigatorWithStandalone.standalone === true;

  return isStandalone || isIOSStandalone;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  // 서버와 클라이언트에서 동일한 초기 상태를 보장 (Hydration mismatch 방지)
  // 클라이언트에서만 실제 상태를 확인하도록 lazy initialization 사용
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return getInitialInstalledState();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // beforeinstallprompt 이벤트 리스너
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // appinstalled 이벤트 리스너 (설치 완료 감지)
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) {
      return { success: false, error: 'Install prompt not available' };
    }

    try {
      // 설치 프롬프트 표시
      await deferredPrompt.prompt();

      // 사용자 선택 대기
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setDeferredPrompt(null);
        return { success: true, outcome: 'accepted' };
      } else {
        return { success: false, outcome: 'dismissed' };
      }
    } catch (error) {
      console.error('Installation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  return {
    isInstallable,
    isInstalled,
    install,
  };
}
