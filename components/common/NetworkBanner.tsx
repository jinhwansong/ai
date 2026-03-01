'use client';

import { useEffect, useState } from 'react';

export default function NetworkBanner() {
  // 초기값은 false. navigator.onLine은 로드 시 불안정할 수 있어
  // 실제 'offline' 이벤트가 발생했을 때만 배너 표시
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-amber-500 py-2 px-4 text-center text-sm font-bold text-white"
      role="alert"
    >
      인터넷 연결이 끊어졌습니다. 연결을 확인한 뒤 새로고침해주세요.
    </div>
  );
}
