import { test, expect } from '@playwright/test';

test('Coffee purchase should be successful', async ({ page }) => {
  await page.goto('https://coffee-cart.netlify.app/');
  await expect(page).toHaveURL('https://coffee-cart.netlify.app/');
  await page.locator('[data-test="Cafe_Latte"]').click();
  await page.locator('[data-test="checkout"]').hover();
  await expect(page.locator('.list-item', { hasText: 'Cafe Latte x 1' })).toBeVisible();
  await page.locator('[data-test="checkout"]').click();
  await expect(page.locator('.modal-content')).toBeVisible();
  await page.getByRole('textbox', { name: 'Name' }).fill('QA');
  await page.getByRole('textbox', { name: 'Email' }).fill('qa@gmail.com');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('button', { name: 'Thanks for your purchase.' })).toBeVisible();
});

test('Purchasing without adding coffee to cart', async ({ page }) => {
  await page.goto('https://coffee-cart.netlify.app/');
  await page.locator('[data-test="checkout"]').click();
  await expect(page.locator('.modal-content')).toBeVisible();
  await page.getByRole('textbox', { name: 'Name' }).fill('QA');
  await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('QA');
  await page.getByRole('textbox', { name: 'Email' }).fill('1@gmail.com');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('1@gmail.com');
  await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
  await expect(page.locator('#promotion')).toBeChecked();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Thanks for your purchase.' });
  await expect(page.getByRole('button', { name: 'Thanks for your purchase.' })).toBeVisible();
});