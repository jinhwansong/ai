/**
 * 시간대별 브리핑 관리 유틸리티
 * 한국 시간(KST) 기준으로 3개 시간대 구분
 */

import { formatInTimeZone } from 'date-fns-tz';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

const KOREA_TIMEZONE = 'Asia/Seoul';

/**
 * 현재 한국 시간 기준 시간대 반환
 * - 09:00 ~ 11:59 → morning
 * - 12:00 ~ 17:59 → afternoon
 * - 18:00 ~ 08:59 → evening
 */
export function getCurrentTimeSlot(): TimeSlot {
  const now = new Date();
  const kstHour = parseInt(formatInTimeZone(now, KOREA_TIMEZONE, 'HH'), 10);

  if (kstHour >= 9 && kstHour < 12) {
    return 'morning';
  } else if (kstHour >= 12 && kstHour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

/**
 * Cron 실행 시점의 시간대 감지 (UTC 기반)
 * - UTC 00:05 → morning (KST 09:05)
 * - UTC 03:05 → afternoon (KST 12:05)
 * - UTC 09:05 → evening (KST 18:05)
 */
export function detectTimeSlotFromCron(): TimeSlot {
  const now = new Date();
  const utcHour = now.getUTCHours();
  const utcMinute = now.getUTCMinutes();

  // Cron 실행 시간 기준 (±10분 허용)
  if (utcHour === 0 && utcMinute >= 0 && utcMinute <= 15) {
    return 'morning'; // KST 09:05
  } else if (utcHour === 3 && utcMinute >= 0 && utcMinute <= 15) {
    return 'afternoon'; // KST 12:05
  } else if (utcHour === 9 && utcMinute >= 0 && utcMinute <= 15) {
    return 'evening'; // KST 18:05
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
      return '오전 브리핑 (09:05)';
    case 'afternoon':
      return '오후 브리핑 (12:05)';
    case 'evening':
      return '저녁 브리핑 (18:05)';
  }
}
