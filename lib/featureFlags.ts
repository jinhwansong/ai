/**
 * 실험·배포 분기. 복잡한 플래그 서비스 대신 env 기준으로 시작.
 * — NEXT_PUBLIC_* 는 클라이언트 번들에 포함됩니다.
 */
export const featureFlags = {
  /** 예: 실험 UI. 기본 false */
  experimentalUi: process.env.NEXT_PUBLIC_FEATURE_EXPERIMENTAL_UI === 'true',
} as const;

export function isFeatureEnabled<K extends keyof typeof featureFlags>(
  key: K
): (typeof featureFlags)[K] {
  return featureFlags[key];
}
