import { test, expect } from '@playwright/test';

test.describe('Сортування колонок і вибір рядків', () => {
  const targetUrl = 'http://104.168.59.50/laboratory/interactions';

  test.beforeEach(async ({ page }) => {
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  });

  // Завдання 1: Перевірте роботу з чек боксами - збільшення кількості Вибрано
  test('Перевірка роботи з чекбоксами - збільшення кількості Вибрано', async ({ page }) => {
    const counter = page.locator('//*[@data-testid="interactions-selected-count"]');
    await expect(counter).toBeVisible();
    await expect(counter).toHaveText('Вибрано: 0');

    // Короткі та стабільні XPath для чекбоксів кожного рядка
    const firstCheckbox = page.locator('//tbody/tr[1]//input');
    const secondCheckbox = page.locator('//tbody/tr[2]//input');
    const thirdCheckbox = page.locator('//tbody/tr[3]//input');
    const fourthCheckbox = page.locator('//tbody/tr[4]//input');

    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
    await expect(counter).toHaveText('Вибрано: 1');

    await secondCheckbox.check();
    await expect(secondCheckbox).toBeChecked();
    await expect(counter).toHaveText('Вибрано: 2');

    await thirdCheckbox.check();
    await expect(thirdCheckbox).toBeChecked();
    await expect(counter).toHaveText('Вибрано: 3');

    await fourthCheckbox.check();
    await expect(fourthCheckbox).toBeChecked();
    await expect(counter).toHaveText('Вибрано: 4');

    // Перевірка зменшення лічильника при знятті вибору
    await fourthCheckbox.uncheck();
    await expect(fourthCheckbox).not.toBeChecked();
    await expect(counter).toHaveText('Вибрано: 3');
  });

  // Завдання 2: Сортування і зміна порядку
  test('Сортування за назвою тесту (Тест) та зміна порядку рядків', async ({ page }) => {
    const sortButton = page.locator('//*[@data-testid="interactions-sort-name"]');
    const header = page.locator("//th[contains(., 'Тест')]");
    const testNames = page.locator('//tbody/tr/td[2]');

    // За замовчуванням: сортування за зростанням
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(testNames).toHaveText([
      'Авторизація',
      'Завантаження файлу',
      'Пошук за тегом',
      'Створення статті'
    ]);

    // Клік для сортування за спаданням
    await sortButton.click();
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await expect(testNames).toHaveText([
      'Створення статті',
      'Пошук за тегом',
      'Завантаження файлу',
      'Авторизація'
    ]);
  });

  test('Сортування за тривалістю (Тривалість) та зміна порядку рядків', async ({ page }) => {
    const sortButton = page.locator('//*[@data-testid="interactions-sort-duration"]');
    const header = page.locator("//th[contains(., 'Тривалість')]");
    const durations = page.locator('//tbody/tr/td[4]');
    const testNames = page.locator('//tbody/tr/td[2]');

    // 1-й клік: сортування за зростанням
    await sortButton.click();
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(durations).toHaveText(['0.0 s', '5.7 s', '8.4 s', '12.1 s']);
    await expect(testNames).toHaveText([
      'Завантаження файлу',
      'Пошук за тегом',
      'Авторизація',
      'Створення статті'
    ]);

    // 2-й клік: сортування за спаданням
    await sortButton.click();
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await expect(durations).toHaveText(['12.1 s', '8.4 s', '5.7 s', '0.0 s']);
    await expect(testNames).toHaveText([
      'Створення статті',
      'Авторизація',
      'Пошук за тегом',
      'Завантаження файлу'
    ]);
  });

  test('Сортування за статусом (Статус) та зміна порядку рядків', async ({ page }) => {
    const sortButton = page.locator('//*[@data-testid="interactions-sort-status"]');
    const header = page.locator("//th[contains(., 'Статус')]");
    const statuses = page.locator('//tbody/tr/td[3]');

    // 1-й клік: сортування статусів за зростанням
    await sortButton.click();
    await expect(header).toHaveAttribute('aria-sort', 'ascending');
    await expect(statuses).toHaveText(['Failed', 'Passed', 'Passed', 'Skipped']);

    // 2-й клік: сортування статусів за спаданням
    await sortButton.click();
    await expect(header).toHaveAttribute('aria-sort', 'descending');
    await expect(statuses).toHaveText(['Skipped', 'Passed', 'Passed', 'Failed']);
  });

  test('Сортування за тривалістю (за спаданням) та вибір усіх рядків', async ({ page }) => {
    const sortButton = page.locator('//*[@data-testid="interactions-sort-duration"]');
    const counter = page.locator('//*[@data-testid="interactions-selected-count"]');

    // 1-й клік: сортування за зростанням (0.0 s -> 12.1 s)
    await sortButton.click();
    // 2-й клік: сортування за спаданням (12.1 s -> 0.0 s)
    await sortButton.click();

    // Вибір усіх чекбоксів
    const checkboxes = page.locator('//tbody//input');
    const totalCheckboxes = await checkboxes.count();

    for (let i = 0; i < totalCheckboxes; i++) {
      await checkboxes.nth(i).check();
      await expect(counter).toHaveText(`Вибрано: ${i + 1}`);
    }

    // Перевірка фінального стану
    await expect(counter).toHaveText('Вибрано: 4');

    // Рядок 1: Створення статті | Failed | 12.1 s
    await expect(page.locator('//tbody/tr[1]/td[2]')).toHaveText('Створення статті');
    await expect(page.locator('//tbody/tr[1]/td[3]')).toHaveText('Failed');
    await expect(page.locator('//tbody/tr[1]/td[4]')).toHaveText('12.1 s');

    // Рядок 4: Завантаження файлу | Skipped | 0.0 s
    await expect(page.locator('//tbody/tr[4]/td[2]')).toHaveText('Завантаження файлу');
    await expect(page.locator('//tbody/tr[4]/td[3]')).toHaveText('Skipped');
    await expect(page.locator('//tbody/tr[4]/td[4]')).toHaveText('0.0 s');
  });
});
