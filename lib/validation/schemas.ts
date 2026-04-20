import { z } from 'zod';

export const pushSubscriptionBodySchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
  userAgent: z.string().optional(),
  userId: z.string().optional(),
});

export const pushUnsubscribeBodySchema = z.object({
  endpoint: z.string().min(1),
});

export const newsListQuerySchema = z.object({
  sort: z.enum(['latest', 'oldest', 'importance']).default('latest'),
  category: z.string().default('all'),
  period: z.preprocess(
    (v) => (v === 'month' ? 'week' : v),
    z.enum(['all', 'today', 'week']).default('all'),
  ),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

/** Gemini 브리핑 파이프라인 입력 — 외부에서 오는 지수 형태가 달라도 서버에서 보정 */
export const briefingInquiryBodySchema = z.object({
  userKeywords: z.array(z.string()),
  marketData: z.object({
    globalIndices: z.array(z.unknown()),
  }),
  newsList: z.array(z.unknown()),
});

export type NewsListQuery = z.infer<typeof newsListQuerySchema>;
