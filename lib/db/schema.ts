import { jsonb, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Supabase `briefing_history`와 맞추기 위한 참조 스키마.
 * 마이그레이션은 `DATABASE_URL`이 Supabase Postgres와 동일할 때만 적용하세요.
 */
export const briefingHistory = pgTable('briefing_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
});
