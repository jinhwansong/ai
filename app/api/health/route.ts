import { NextResponse } from 'next/server';
import { redis } from '@/lib/core/redis';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * 로드밸러·모니터링용. Redis ping + Supabase 단건 조회.
 * 타임아웃은 플랫폼/클라이언트에서 별도 설정.
 */
export async function GET() {
  const checks: { redis: boolean; database: boolean } = {
    redis: false,
    database: false,
  };

  try {
    const pong = await redis.ping();
    checks.redis = pong === 'PONG';
  } catch {
    checks.redis = false;
  }

  try {
    const { error } = await supabase.from('news_articles').select('id').limit(1);
    checks.database = !error;
  } catch {
    checks.database = false;
  }

  const ok = checks.redis && checks.database;
  return NextResponse.json(
    { ok, checks, timestamp: new Date().toISOString() },
    { status: ok ? 200 : 503 }
  );
}
