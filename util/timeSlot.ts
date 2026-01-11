/**
 * 시간대별 브리핑 관리 유틸리티
 * 한국 시간(KST) 기준으로 3개 시간대 구분
 */

import { formatInTimeZone } from 'date-fns-tz';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

const KOREA_TIMEZONE = 'Asia/Seoul';

/**
 * 현재 한국 시간 기준 시간대 반환
 * - 08:00 ~ 11:59 → morning
 * - 12:00 ~ 17:59 → afternoon
 * - 18:00 ~ 07:59 → evening
 */
export function getCurrentTimeSlot(): TimeSlot {
  const now = new Date();
  const kstHour = parseInt(formatInTimeZone(now, KOREA_TIMEZONE, 'HH'), 10);

  if (kstHour >= 8 && kstHour < 12) {
    return 'morning';
  } else if (kstHour >= 12 && kstHour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

/**
 * Cron 실행 시점의 시간대 감지 (UTC 기반, GitHub Actions/Vercel Cron 등)
 * 현재 repo 스케줄(.github/workflows/cron.yml):
 * - UTC 23:30 → morning (KST 08:30)
 * - UTC 05:00 → afternoon (KST 14:00)
 * - UTC 09:00 → evening (KST 18:00)
 */
export function detectTimeSlotFromCron(): TimeSlot {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();

  // Cron 실행 시간 기준 (±20분 허용)
  // - 23:30 (UTC): 23:10 ~ 23:50
  if (utcHour === 23 && utcMinute >= 10 && utcMinute <= 50) {
    return 'morning'; // KST 08:30
  }
  // - 05:00 (UTC): 04:40 ~ 05:20
  if ((utcHour === 4 && utcMinute >= 40) || (utcHour === 5 && utcMinute <= 20)) {
    return 'afternoon'; // KST 14:00
  }
  // - 09:00 (UTC): 08:40 ~ 09:20
  if ((utcHour === 8 && utcMinute >= 40) || (utcHour === 9 && utcMinute <= 20)) {
    return 'evening'; // KST 18:00
  }

  // Fallback: 현재 한국 시간 기준으로 판단
  return getCurrentTimeSlot();
}

/**
 * Redis 키 생성 (시간대별)
 */
export function getTimeSlotRedisKey(slot: TimeSlot): string {
  return `dashboard:${slot}`;
}

/**
 * 시간대 한글 표시
 */
export function getTimeSlotLabel(slot: TimeSlot): string {
  switch (slot) {
    case 'morning':
      return '오전 브리핑 (08:30)';
    case 'afternoon':
      return '오후 브리핑 (14:00)';
    case 'evening':
      return '저녁 브리핑 (18:00)';
  }
}
