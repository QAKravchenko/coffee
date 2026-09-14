import { test, expect } from '@playwright/test';

test('Check cooffee purchase', async ({ page }) => {
  await page.goto('https://coffee-cart.netlify.app/');
  await expect(page.locator('[data-test="Cafe_Latte"]')).toBeVisible();
  await expect(page.locator('#app')).toContainText('Cafe Latte $16.00');
  await page.locator('[data-test="Cafe_Latte"]').click();
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('QA');
  await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('QA');
  await page.getByRole('textbox', { name: 'Email' }).fill('qa@gmail.com');
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('qa@gmail.com');
  await page.getByRole('button', { name: 'Submit' }).click();
});

test('Adding coffee to cart using popup', async ({ page }) => {
  await page.goto('https://coffee-cart.netlify.app/');
  await page.locator('[data-test="Cappuccino"]').click({
    button: 'right'
  });
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.locator('span').filter({ hasText: 'Cappuccino' }).click();
});

test('Purchasing without adding coffee to cart', async ({ page }) => {
  await page.goto('https://coffee-cart.netlify.app/');
  await page.locator('[data-test="checkout"]').click();
  await page.getByRole('textbox', { name: 'Name' }).fill('QA');
  await page.getByRole('textbox', { name: 'Email' }).fill('1@gmail.com');
  await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.getByRole('button', { name: 'Thanks for your purchase.' });
});

test('Change quantity of added coffee via popup', async ({ page }) => {
  await page.goto('https://coffee-cart.netlify.app/');
  await page.locator('[data-test="Flat_White"]').click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $18.00');
  await page.getByRole('button', { name: 'Add one Flat White' }).click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $36.00');
  await page.getByRole('button', { name: 'Remove one Flat White' }).click();
  await expect(page.locator('[data-test="checkout"]')).toContainText('Total: $18.00');
});

test('Removing coffee from cart', async ({ page }) => {
  await page.goto('https://coffee-cart.netlify.app/');
  await page.locator('[data-test="Americano"]').click();
  await page.getByRole('link', { name: 'Cart page' }).click();
  await expect(page.locator('div').filter({ hasText: /^Americano$/ })).toBeVisible();
  await expect(page.locator('#app')).toContainText('Americano');
  await page.getByRole('button', { name: 'Remove all Americano' }).click();
  await expect(page.getByRole('paragraph')).toContainText('No coffee, go add some.');
});