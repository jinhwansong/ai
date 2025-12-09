import { NewsArticle } from '@/types/news';
import { kv } from '@vercel/kv';

/**
 * 데일리 리포트 저장
 */
export async function saveDailyReport(data: NewsArticle[]) {
  return kv.set('daily-report', data);
}

/**
 * 데일리 리포트 읽기
 */
export async function getDailyReport() {
  return kv.get('daily-report');
}
