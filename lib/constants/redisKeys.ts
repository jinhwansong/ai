/**
 * Redis 키·TTL 단일 출처. 문자열 리터럴 대신 여기서 import 해 일관성 유지.
 * 상세 표는 docs/REDIS_KEYS.md 참고.
 */

/** 실시간 글로벌 지수 (Yahoo Finance 캐시) */
export const REDIS_KEY_MARKET_INDICES_LIVE = 'market:indices:live';

/** 메인 대시보드 JSON (브리핑 파이프라인 결과) */
export const REDIS_KEY_DASHBOARD_LATEST = 'dashboard:latest';

/** 섹터 전략 전용 스냅샷 (TTL 없음 — 수동/크론 갱신 시 덮어씀) */
export const REDIS_KEY_STRATEGY_LATEST = 'strategy:latest';

/** 브리핑 생성 진행 상태 `briefing:progress:<runId>` */
export function redisKeyBriefingProgress(runId: string | number): string {
  return `briefing:progress:${runId}`;
}

export const REDIS_TTL_MARKET_INDICES_SEC = 300;

/** 대시보드·슬롯 캐시 (generate-briefing / warmCache와 동일) */
export const REDIS_TTL_DASHBOARD_SEC = 86400;

/** 브리핑 진행·성공 상태 (진행 중) */
export const REDIS_TTL_BRIEFING_PROGRESS_SEC = 3600;

/** 브리핑 실패 정보 */
export const REDIS_TTL_BRIEFING_ERROR_SEC = 7200;
