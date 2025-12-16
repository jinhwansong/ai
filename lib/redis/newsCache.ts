import { DailyReport } from "@/types/report";
import { redis } from "./redis";


// 날짜별 리포트를 저장할 Redis 키 패턴
function buildDailyReportKey(date: string): string {
  return `daily-report:${date}`;
}

// 다음날 09:00까지 TTL계산
function getTTLUntilNext9AM(): number {
  const now = new Date();
  const next = new Date();

  next.setDate(now.getDate() + 1);
  next.setHours(9, 0, 0, 0);

  return Math.floor((next.getTime() - now.getTime()) / 1000);
}

export async function saveDailyReport(report: DailyReport) {
  const key = buildDailyReportKey(report.date)

  if (
    !report.briefing ||
    !Array.isArray(report.briefing.keyIssues) ||
    report.briefing.keyIssues.length === 0
  ) {
    console.error('캐시 저장 거부', {
      key,
      report,
    });
    throw new Error('저장할 데일리 리포트에 키가 없습니다.');
  }

  const ttl = getTTLUntilNext9AM();

  await redis.set(key, JSON.stringify(report), 'EX', ttl)

}

export async function getDailyReport(
  date: string
): Promise<DailyReport | null> {
  const key = buildDailyReportKey(date);
  const cachedValue = await redis.get(key);

  if (!cachedValue) {
    console.warn(`[dailyReportCache] 캐시 미스: ${key}`);
    return null;
  }

  try {
    const parsed = JSON.parse(cachedValue) as DailyReport;
    console.log(
      `[dailyReportCache] 캐시 적중: ${key} (keyIssues: ${
        parsed.briefing?.keyIssues?.length ?? 0
      })`
    );
    return parsed;
  } catch (error) {
    console.error(`[dailyReportCache] Redis 파싱 실패: ${key}`, error);
    return null;
  }
}