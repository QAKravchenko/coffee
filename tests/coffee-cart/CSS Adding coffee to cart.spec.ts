import { test, expect } from '@playwright/test';

test.describe('Actions with adding, editing, removing coffee in cart', () => {

  test('Adding coffee to cart using popup, should be added', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('https://coffee-cart.netlify.app/');
    await page.locator('[data-test="Cappuccino"]').click({ button: 'right' });
    await expect(page.locator('[data-cy="add-to-cart-modal"]')).toBeVisible();
    await page.locator('button:has-text("Yes")').click();
    await page.locator('[data-test="checkout"]').hover();
    await expect(page.locator('.list-item', { hasText: 'Cappuccino x 1' })).toBeVisible();
  });

  test('Change quantity of added coffee via popup', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="Flat_White"]').click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $18.00');
    await page.locator('[data-test="checkout"]').hover();
    await page.locator('[aria-label="Add one Flat White"]').click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $36.00');
    await page.locator('[aria-label="Remove one Flat White"]').click();
    await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $18.00');
  });

  test('Removing coffee from cart', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-test="Americano"]').click();
    await page.locator('[aria-label="Cart page"]').click();
    await expect(page.locator('div').filter({ hasText: /^Americano$/ })).toBeVisible();
    await expect(page.locator('#app')).toContainText('Americano');
    await page.locator('.list-item .delete').click();
    await expect(page.locator('.list p:has-text("No coffee, go add some.")')).toBeVisible();
  });
});
