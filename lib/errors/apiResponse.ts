import { NextResponse } from 'next/server';

/** 성공 응답 표준 */
export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: { pagination?: object; timestamp?: string };
};

/** 에러 응답 표준 (4xx/5xx) */
export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Route Handler에서 에러 반환 헬퍼 */
export function apiError(
  message: string,
  status: number,
  code: string = 'INTERNAL',
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    } satisfies ApiErrorResponse,
    { status }
  );
}
