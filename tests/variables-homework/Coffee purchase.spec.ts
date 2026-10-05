import { test, expect } from '@playwright/test';

// Просунутий рівень:
// Спільний URL та текст повідомлення про успішну покупку винесено у змінні на рівні файлу,
// оскільки вони є статичними рядковими даними і не потребують екземпляра page для ініціалізації.
// Локатори ж обов'язково створюються всередині кожного тесту, де фікстура page доступна.
const baseUrl = 'https://coffee-cart.netlify.app/';
const successMessageText = 'Thanks for your purchase.';

test.describe('Coffee purchase', () => {

  test('Coffee purchase should be successful', async ({ page }) => {
    const cafeLatteItem = page.locator('[data-test="Cafe_Latte"]');
    // Локатор checkoutButton використовується для hover і наступного click
    const checkoutButton = page.locator('[data-test="checkout"]');
    const cartItem = page.locator('.list-item', { hasText: 'Cafe Latte x 1' });
    const nameInput = page.locator('#name');
    const emailInput = page.locator('#email');
    const submitPaymentButton = page.locator('#submit-payment');
    const successSnackbar = page.locator('.snackbar.success', { hasText: successMessageText });

    await page.goto(baseUrl);
    await cafeLatteItem.click();
    await checkoutButton.hover();
    await expect(cartItem).toBeVisible();
    await checkoutButton.click();
    await nameInput.fill('QA');
    await emailInput.fill('qa@gmail.com');
    await submitPaymentButton.click();
    await expect(successSnackbar).toBeVisible();
  });

  test('Purchasing without adding coffee to cart', async ({ page }) => {
    const checkoutButton = page.locator('[data-test="checkout"]');
    const modalContent = page.locator('.modal-content');
    // Локатори nameInput та emailInput використовуються двічі:
    // спочатку для заповнення (.fill), а потім для перевірки значення (.toHaveValue)
    const nameInput = page.locator('#name');
    const emailInput = page.locator('#email');
    const submitPaymentButton = page.locator('#submit-payment');
    const successSnackbar = page.locator('.snackbar.success', { hasText: successMessageText });

    await page.goto(baseUrl);
    await checkoutButton.click();
    await expect(modalContent).toBeVisible();
    await nameInput.fill('QA');
    await expect(nameInput).toHaveValue('QA');
    await emailInput.fill('1@gmail.com');
    await expect(emailInput).toHaveValue('1@gmail.com');
    await submitPaymentButton.click();
    await expect(successSnackbar).toBeVisible();
  });
});
