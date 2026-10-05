import { test, expect } from '@playwright/test';

test.describe('Coffee purchase', () => {
    test('Coffee purchase should be successful', async ({ page }) => {
        await page.goto('/');
        await page.locator('[data-test="Cafe_Latte"]').click();
        await page.locator('[data-test="checkout"]').hover();
        await expect(page.locator('.list-item', { hasText: 'Cafe Latte x 1' })).toBeVisible();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('#name').fill('QA');
        await page.locator('#email').fill('qa@gmail.com');
        await page.locator('#submit-payment').click();
        await expect(page.locator('.snackbar.success', {hasText: "Thanks for your purchase."})).toBeVisible();
    });

    test('Purchasing without adding coffee to cart', async ({ page }) => {
        await page.goto('/');
        await page.locator('[data-test="checkout"]').click();
        await expect(page.locator('.modal-content')).toBeVisible();
        await page.locator('#name').fill('QA');
        await expect(page.locator('#name')).toHaveValue('QA');
        await page.locator('#email').fill('1@gmail.com');
        await expect(page.locator('#email')).toHaveValue('1@gmail.com');
        await page.locator('#submit-payment').click();
        await expect(page.locator('.snackbar.success', {hasText: "Thanks for your purchase."})).toBeVisible();
    });
});