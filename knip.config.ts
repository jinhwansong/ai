import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: ['next.config.ts', 'app/**/*.{ts,tsx}', 'sentry.*.config.ts'],
  project: ['**/*.{ts,tsx}'],
  ignore: ['e2e/**', 'playwright-report/**', 'test-results/**'],
};

export default config;
