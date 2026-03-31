import { ZodError } from 'zod';
import { apiError } from '@/lib/errors/apiResponse';
import { newsListQuerySchema } from '@/lib/validation/schemas';

export function jsonValidationError(error: ZodError) {
  return apiError('요청 본문이 올바르지 않습니다.', 422, 'VALIDATION_ERROR', error.flatten());
}

export function queryValidationError(error: ZodError) {
  return apiError('쿼리 파라미터가 올바르지 않습니다.', 400, 'VALIDATION_ERROR', error.flatten());
}

export function parseNewsListSearchParams(searchParams: URLSearchParams) {
  const raw = {
    sort: searchParams.get('sort') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    period: searchParams.get('period') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  };
  return newsListQuerySchema.safeParse(raw);
}
