import { redis } from '@/lib/redis';
import type { DailyReport } from '@/types/report';

function buildDailyReportKey(date: string): string {
  // 날짜별 리포트를 저장할 Redis 키 패턴
  return `daily-report:${date}`;
}

export async function saveDailyReport(date: string, data: DailyReport): Promise<void> {
  const key = buildDailyReportKey(date);
  if (!data || !Array.isArray(data.issues) || data.issues.length === 0) {
    console.error('[newsCache] 저장 거부: issues가 비었습니다.', { key, data });
    throw new Error('저장할 리포트에 issues가 없습니다.');
  }

  await redis.set(key, JSON.stringify(data));
  console.log(`[newsCache] 저장 완료: ${key} (issues: ${data.issues.length}개)`);
}

export async function getDailyReport(date: string): Promise<DailyReport | null> {
  const key = buildDailyReportKey(date);
  const cachedValue = await redis.get(key);
  if (!cachedValue) {
    console.warn(`[newsCache] 캐시 미스: ${key}`);
    return null;
  }

  try {
    const parsed = JSON.parse(cachedValue) as DailyReport;
    console.log(
      `[newsCache] 캐시 적중: ${key} (issues: ${parsed.issues?.length ?? 0}개)`
    );
    return parsed;
  } catch (error) {
    console.error('Redis에 저장된 데일리 리포트 파싱 실패', error);
    return null;
  }
}

