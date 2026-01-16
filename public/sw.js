// 캐시 버전 관리
const CACHE_VERSION = 'market-v1';
const CACHE_NAME = `market-${CACHE_VERSION}`;
const RUNTIME_CACHE = 'market-runtime';
const IMAGE_CACHE = 'market-images';

// 프리캐시할 핵심 자산
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html',
];

// 캐시할 API 경로 패턴
const API_CACHE_PATTERNS = [
  /^\/api\/main\//,
];

// 캐시하지 않을 경로
const EXCLUDE_PATTERNS = [
  /^\/api\/internal\//,
  /^\/api\/push\//, 
];

// 설치 이벤트 - 프리캐싱
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch((error) => {
        console.error('[SW] Precaching failed:', error);
        // 일부 실패해도 계속 진행
      })
  );
  self.skipWaiting(); // 즉시 활성화
});

// 활성화 이벤트 - 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 현재 버전이 아닌 모든 캐시 삭제
          if (cacheName !== CACHE_NAME && 
              cacheName !== RUNTIME_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // 모든 클라이언트 제어
});

// 네트워크 우선 전략 (실시간 데이터용)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    // 성공 시 캐시에 저장
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // 네트워크 실패 시 캐시에서 반환
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // 캐시도 없으면 오프라인 페이지
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// 캐시 우선 전략 (정적 자산용)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // 네트워크 실패 시 기본 응답
    if (request.destination === 'image') {
      return new Response('', { status: 404 });
    }
    throw error;
  }
}

// Stale-While-Revalidate 전략 (자주 변경되는 데이터)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await caches.match(request);
  
  // 백그라운드에서 최신 데이터 가져오기
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // 네트워크 실패는 무시 (캐시된 데이터 사용)
  });
  
  // 캐시된 데이터가 있으면 즉시 반환, 없으면 네트워크 대기
  return cachedResponse || fetchPromise;
}

// 이미지 캐싱 전략
async function imageCache(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // 이미지 캐시 크기 제한 (최대 50개)
      const keys = await cache.keys();
      if (keys.length >= 50) {
        await cache.delete(keys[0]);
      }
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    return new Response('', { status: 404 });
  }
}

// Fetch 이벤트 - 요청 가로채기
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 같은 origin이 아니면 처리하지 않음
  if (url.origin !== location.origin) {
    return;
  }
  
  // 제외 패턴 확인
  if (EXCLUDE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return;
  }
  
  // 전략 선택
  if (request.method !== 'GET') {
    return; // GET 요청만 캐싱
  }
  
  // 이미지 요청
  if (request.destination === 'image') {
    event.respondWith(imageCache(request));
    return;
  }
  
  // API 요청 (메인 데이터)
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  
  // HTML 페이지 (네비게이션)
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // 정적 자산 (JS, CSS, 폰트 등)
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.destination === 'font') {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // 기타 요청은 네트워크 우선
  event.respondWith(networkFirst(request));
});
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || '알림';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/icon-192x192.png',
    image: data.image,
    data: data.data || {},
    tag: 'market-briefing',
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 이미 열려있는 탭이 있으면 포커스
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // 새 탭 열기
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

self.addEventListener('notificationclose', (event) => {
  // 알림이 닫혔을 때 필요한 로깅 등
  console.log('Notification closed:', event.notification.tag);
});