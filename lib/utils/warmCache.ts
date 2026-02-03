import { supabase } from '@/lib/supabase';
import { redis } from '@/lib/core/redis';
import { detectTimeSlotFromCron, getTimeSlotRedisKey } from '@/lib/utils/timeSlot';

const REDIS_TTL_SECONDS = 86400; // 24h, generate-briefing과 동일

/**
 * briefing_history에서 최신 브리핑을 가져와 Redis에 채움.
 * 파이프라인 스킵(새 뉴스 없음) 시에도 대시보드가 마지막 데이터를 보여주도록 함.
 */
export async function warmCacheFromLatestBriefing(): Promise<boolean> {
  try {
    const { data: row, error } = await supabase
      .from('briefing_history')
      .select('data')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[WarmCache] Failed to fetch latest briefing:', error);
      return false;
    }

    const main = (row?.data as { main?: unknown })?.main;
    if (!main || typeof main !== 'object') {
      console.log('[WarmCache] No briefing_history row or missing data.main. Skip warming.');
      return false;
    }

    const timeSlot = detectTimeSlotFromCron();
    const timeSlotKey = getTimeSlotRedisKey(timeSlot);
    const payload = JSON.stringify(main);

    await redis.set(timeSlotKey, payload, 'EX', REDIS_TTL_SECONDS);
    await redis.set('dashboard:latest', payload, 'EX', REDIS_TTL_SECONDS);

    console.log(`[WarmCache] Redis warmed with latest briefing (slot: ${timeSlot}).`);
    return true;
  } catch (err) {
    console.error('[WarmCache] Error:', err);
    return false;
  }
}
