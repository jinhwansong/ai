import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';


const nextConfig: NextConfig = {
  experimental: {
    // CSS 인라인 → 렌더 차단 체인 제거, FCP/LCP 개선 (Tailwind에 적합)
    inlineCss: true,
    // framer-motion 트리쉐이킹으로 불필요한 번들 감소
    optimizePackageImports: ['framer-motion'],
  },
};

export default withSentryConfig(nextConfig, {
  org: 'jimmit',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
