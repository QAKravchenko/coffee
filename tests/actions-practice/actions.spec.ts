import { test, expect } from '@playwright/test';
import {
  addCoffeeToCart,
  openCartPreview,
  fillAndSubmitPaymentForm,
  setDurationSortDescending,
  selectFirstNCheckboxes,
} from './page-actions';

test.describe('Рефакторинг дій: використання функцій із модуля page-actions', () => {

  // ==========================================
  // Тест 1 із проєкту Coffee Cart
  // ==========================================
  test('Проєкт 1 (Coffee Cart): успішна купівля кави з заповненням форми', async ({ page }) => {
    const customerName = 'QA';
    const customerEmail = 'qa@gmail.com';

    await page.goto('https://coffee-cart.netlify.app/');

    // Виклик винесених функцій дій
    await addCoffeeToCart(page, 'Cafe_Latte');
    await openCartPreview(page);

    // Перевірка expect залишається в тесті
    await expect(page.locator('.list-item', { hasText: 'Cafe Latte x 1' })).toBeVisible();

    // Об'єднана функція заповнення та відправки форми оплати
    await fillAndSubmitPaymentForm(page, customerName, customerEmail);

    // Перевірка expect залишається в тесті
    await expect(page.locator('.snackbar.success', { hasText: 'Thanks for your purchase.' })).toBeVisible();
  });

  // ==========================================
  // Тест 2 із проєкту QA Dojo Laboratory
  // ==========================================
  test('Проєкт 2 (QA Dojo Laboratory): сортування за тривалістю за спаданням та вибір рядків', async ({ page }) => {
    await page.goto('http://104.168.59.50/laboratory/interactions', { waitUntil: 'domcontentloaded' });

    // Виклики функцій дій із модуля
    await setDurationSortDescending(page);
    await selectFirstNCheckboxes(page, 4);

    // Усі перевірки expect залишаються в тесті
    await expect(page.locator('//*[@data-testid="interactions-selected-count"]')).toHaveText('Вибрано: 4');
    await expect(page.locator('//th[contains(., "Тривалість")]')).toHaveAttribute('aria-sort', 'descending');

    // Перевірка 1-го рядка після сортування (найтриваліший)
    await expect(page.locator('//tbody/tr[1]/td[2]')).toHaveText('Створення статті');
    await expect(page.locator('//tbody/tr[1]/td[4]')).toHaveText('12.1 s');

    // Перевірка 4-го рядка після сортування (найшвидший)
    await expect(page.locator('//tbody/tr[4]/td[2]')).toHaveText('Завантаження файлу');
    await expect(page.locator('//tbody/tr[4]/td[4]')).toHaveText('0.0 s');
  });
});
