import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';


const nextConfig: NextConfig = {
 
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
