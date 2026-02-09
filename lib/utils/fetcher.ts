import { reportError } from '@/lib/core/sentry';

type FetcherOptions = RequestInit & {
  json?: boolean;
};

function getAbsoluteUrl(url: string | URL): string {
  if (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))) {
    return url;
  }
  
  if (url instanceof URL) {
    return url.toString();
  }
  
  if (typeof window === 'undefined') {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    return `${baseUrl}/${url}`;
  }
  
  // 클라이언트 사이드는 상대 경로 그대로 사용
  return url;
}

export async function Fetcher<T>(
  input: RequestInfo,
  options?: FetcherOptions
): Promise<T> {
  try {
    const url = typeof input === 'string' ? getAbsoluteUrl(input) : 
                input instanceof URL ? getAbsoluteUrl(input) :
                getAbsoluteUrl(input.url);
    
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });

    if (!res.ok) {
      const message = await res.text().catch(() => '');
      const error = new Error(message || 'api 요청실패');

      // Sentry에 API 에러 보고
      reportError(error, {
        url: typeof input === 'string' ? input : input.url,
        status: res.status,
        statusText: res.statusText,
        options,
      });

      throw error;
    }

    return options?.json === false
      ? (res as unknown as T)
      : (res.json() as Promise<T>);
  } catch (error) {
    // 네트워크 에러 등 예기치 못한 에러 보고
    if (error instanceof Error && error.message !== 'api 요청실패') {
      reportError(error, {
        url: typeof input === 'string' ? input : input.url,
        context: 'Fetcher Network Error',
      });
    }
    throw error;
  }
}
