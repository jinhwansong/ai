/**
 * KST(Asia/Seoul) 기준 시간 유틸 — 브리핑 슬롯·Redis 키·UI 메타·상대 시각
 */

import { formatDistanceToNow } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ko } from 'date-fns/locale';

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
  }
  if (kstHour >= 12 && kstHour < 18) {
    return 'afternoon';
  }
  return 'evening';
}

/**
 * Cron·수동 실행 시 Redis에 쓸 시간대 슬롯
 * - GitHub Actions 스케줄이 하루 여러 번이어도, 실행 시점의 KST 시각으로
 *   오전/오후/저녁 버킷을 정하면 사용자-facing API(getCurrentTimeSlot)와 일치합니다.
 */
export function detectTimeSlotFromCron(): TimeSlot {
  return getCurrentTimeSlot();
}

/** Redis 키 생성 (시간대별) */
export function getTimeSlotRedisKey(slot: TimeSlot): string {
  return `dashboard:${slot}`;
}

/** 시간대 한글 표시 */
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

/** 카드·헤더용 “오늘 브리핑” 날짜·다음 발행 시각 라벨 (KST) */
export function getDailyBriefingMeta() {
  const now = new Date();
  const date = formatInTimeZone(now, KOREA_TIMEZONE, 'yyyy-MM-dd');
  const hour = parseInt(formatInTimeZone(now, KOREA_TIMEZONE, 'HH'), 10);
  let publishTime: '08:30 AM' | '14:00 PM' | '18:00 PM';
  if (hour >= 18) {
    publishTime = '18:00 PM';
  } else if (hour >= 14) {
    publishTime = '14:00 PM';
  } else {
    publishTime = '08:30 AM';
  }
  return { date, publishTime };
}

/** 목록·검색 등에서 사용하는 상대 시각 (한국어) */
export function formatPublishedAt(publishedAt: string) {
  return formatDistanceToNow(new Date(publishedAt), {
    addSuffix: true,
    locale: ko,
  });
}
