import { z } from 'zod';

/**
 * 프로덕션에서 반드시 있어야 하는 서버/빌드 공통 변수.
 * (NEXT_PUBLIC_* 는 클라이언트 번들에도 노출됨)
 */
const productionRequiredSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  REDIS_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1),
  CRON_SECRET: z.string().min(1),
});

/**
 * 배포·프로덕션 런타임에서 필수 env가 비어 있으면 조기 실패.
 * - 로컬/테스트: 기본적으로 스킵
 * - CI에서 빌드만 할 때: SKIP_ENV_VALIDATION=1
 */
export function validateProductionEnv(): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }
  if (process.env.SKIP_ENV_VALIDATION === "1") {
    return;
  }

  const result = productionRequiredSchema.safeParse(process.env);
  if (!result.success) {
    const msg = `[env] 프로덕션 필수 환경변수가 없거나 형식이 잘못되었습니다: ${JSON.stringify(
      result.error.flatten().fieldErrors
    )}`;
    console.error(msg);
    throw new Error(msg);
  }
}
