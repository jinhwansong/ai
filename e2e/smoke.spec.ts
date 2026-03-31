import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('홈 타이틀 로드', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/오늘의 시그널/);
  });
});
