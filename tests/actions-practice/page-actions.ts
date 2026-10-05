import type { Page } from '@playwright/test';

// ==========================================
// Дії для Проєкту 1: Coffee Cart
// ==========================================

/**
 * Додає каву в кошик за назвою (data-test)
 * @param page - фікстура Playwright Page
 * @param coffeeName - назва кави (наприклад, 'Cafe_Latte')
 */
export async function addCoffeeToCart(page: Page, coffeeName: string) {
  await page.locator(`[data-test="${coffeeName}"]`).click();
}

/**
 * Відкриває прев'ю кошика наведенням курсору
 * @param page - фікстура Playwright Page
 */
export async function openCartPreview(page: Page) {
  await page.locator('[data-test="checkout"]').hover();
}

/**
 * Об'єднана функція: відкриває форму оплати, заповнює Name та Email і надсилає форму
 * @param page - фікстура Playwright Page
 * @param name - ім'я покупця
 * @param email - email покупця
 */
export async function fillAndSubmitPaymentForm(
  page: Page,
  name: string,
  email: string
) {
  await page.locator('[data-test="checkout"]').click();
  await page.locator('#name').fill(name);
  await page.locator('#email').fill(email);
  await page.locator('#submit-payment').click();
}

// ==========================================
// Дії для Проєкту 2: QA Dojo Laboratory (Sortable Table)
// ==========================================

/**
 * Клікає по кнопці сортування колонки таблиці
 * @param page - фікстура Playwright Page
 * @param columnName - ім'я колонки ('name' | 'duration' | 'status')
 */
export async function sortByColumn(page: Page, columnName: 'name' | 'duration' | 'status') {
  await page.locator(`//*[@data-testid="interactions-sort-${columnName}"]`).click();
}

/**
 * Об'єднана функція: встановлює сортування за тривалістю за спаданням (робить 2 кліки)
 * @param page - фікстура Playwright Page
 */
export async function setDurationSortDescending(page: Page) {
  const durationButton = page.locator('//*[@data-testid="interactions-sort-duration"]');
  await durationButton.click();
  await durationButton.click();
}

/**
 * Об'єднана функція: по черзі відзначає перші N чекбоксів у таблиці
 * @param page - фікстура Playwright Page
 * @param count - кількість чекбоксів для вибору
 */
export async function selectFirstNCheckboxes(page: Page, count: number) {
  const checkboxes = page.locator('//tbody//input');
  for (let i = 0; i < count; i++) {
    await checkboxes.nth(i).check();
  }
}
