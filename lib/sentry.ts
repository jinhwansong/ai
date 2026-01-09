import * as Sentry from '@sentry/nextjs';

/**
 * 전역에서 사용할 수 있는 에러 보고 유틸리티입니다.
 * try-catch 블록이나 에러 핸들러에서 호출하여 Sentry로 에러를 전송합니다.
 */
export const reportError = (error: unknown, context?: Record<string, unknown>) => {
  console.error('Reported Error:', error, context);

  if (error instanceof Error) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    Sentry.captureMessage(typeof error === 'string' ? error : JSON.stringify(error), {
      level: 'error',
      extra: context,
    });
  }
};

/**
 * 사용자 정보를 Sentry 컨텍스트에 설정합니다.
 */
export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  Sentry.setUser(user);
};

/**
 * Sentry에 브레드크럼을 추가합니다.
 */
export const addBreadcrumb = (message: string, category?: string, data?: Record<string, unknown>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
};
