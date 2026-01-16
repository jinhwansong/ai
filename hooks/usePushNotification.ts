'use client';

import { useEffect, useState, useCallback } from 'react';

interface PushSubscriptionState {
  subscription: PushSubscription | null;
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * 웹 푸시 알림 구독을 관리하는 React Hook
 */
export function usePushNotification() {
  const [state, setState] = useState<PushSubscriptionState>({
    subscription: null,
    isSupported: false,
    isSubscribed: false,
    isLoading: true,
    error: null,
  });

  // ArrayBuffer를 Base64로 변환
  const arrayBufferToBase64 = useCallback((buffer: ArrayBuffer | null): string => {
    if (!buffer) return '';
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }, []);

  // Service Worker 등록 및 구독
  const subscribe = useCallback(async () => {
    if (!state.isSupported) {
      setState((prev) => ({ ...prev, error: 'Push notifications are not supported' }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Service Worker 등록
      const registration = await navigator.serviceWorker.ready;
      
      // 브라우저 알림 권한 요청
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // VAPID 공개 키
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error('VAPID public key is not configured');
      }

      // Push 구독 생성
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as unknown as BufferSource,
      });

      // 구독 정보를 서버에 저장
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
            auth: arrayBufferToBase64(subscription.getKey('auth')),
          },
          userAgent: navigator.userAgent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save subscription');
      }

      setState({
        subscription,
        isSupported: true,
        isSubscribed: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Push subscription failed:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [state.isSupported, arrayBufferToBase64]);

  // 구독 해제
  const unsubscribe = useCallback(async () => {
    if (!state.subscription) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // 서버에서 구독 삭제
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: state.subscription.endpoint,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove subscription');
      }

      // 로컬 구독 해제
      await state.subscription.unsubscribe();

      setState({
        subscription: null,
        isSupported: state.isSupported,
        isSubscribed: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Push unsubscribe failed:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, [state.subscription, state.isSupported]);

  // 초기화: Service Worker 등록 및 기존 구독 확인
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const init = async () => {
      // 브라우저 지원 여부 확인
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setState((prev) => ({
          ...prev,
          isSupported: false,
          isLoading: false,
        }));
        return;
      }

      try {
        // Service Worker 등록
        await navigator.serviceWorker.register('/sw.js');

        // 기존 구독 확인
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();

        setState({
          subscription: existingSubscription,
          isSupported: true,
          isSubscribed: !!existingSubscription,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        setState((prev) => ({
          ...prev,
          isSupported: false,
          isLoading: false,
          error: 'Service Worker registration failed',
        }));
      }
    };

    init();
  }, []);

  return {
    ...state,
    subscribe,
    unsubscribe,
  };
}

/**
 * VAPID 공개 키를 Uint8Array로 변환
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
