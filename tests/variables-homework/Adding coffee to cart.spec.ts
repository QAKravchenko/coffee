import { test, expect } from '@playwright/test';

// Просунутий рівень:
// baseUrl винесено у змінну на рівні файлу (зовнішня область видимості),
// оскільки це звичайний статичний рядок, який не залежить від фікстури page.
// Натомість локатори (page.locator(...), page.getByRole(...) тощо) залежать від фікстури page
// конкретного тестового контексту, тому їх потрібно оголошувати всередині тестової функції.
const baseUrl = 'https://coffee-cart.netlify.app/';

test.describe('Actions with adding, editing, removing coffee in cart', () => {

  test('Adding coffee to cart using popup, should be added', async ({ page }) => {
    // Оголошення локаторів усередині тесту, де доступна фікстура page
    const cappuccinoItem = page.locator('[data-test="Cappuccino"]');
    const addToCartModal = page.locator('[data-cy="add-to-cart-modal"]');
    const confirmButton = page.locator('button:has-text("Yes")');
    const checkoutButton = page.locator('[data-test="checkout"]');
    const cartItem = page.locator('.list-item', { hasText: 'Cappuccino x 1' });

    await page.goto(baseUrl);
    await expect(page).toHaveURL(baseUrl);
    await cappuccinoItem.click({ button: 'right' });
    await expect(addToCartModal).toBeVisible();
    await confirmButton.click();
    await checkoutButton.hover();
    await expect(cartItem).toBeVisible();
  });

  test('Change quantity of added coffee via popup', async ({ page }) => {
    const flatWhiteItem = page.locator('[data-test="Flat_White"]');
    // Локатор checkoutButton використовується неодноразово (hover та перевірки тексту),
    // тому збереження у змінну запобігає дублюванню коду пошуку елемента
    const checkoutButton = page.locator('[data-test="checkout"]');
    const addOneFlatWhiteButton = page.locator('[aria-label="Add one Flat White"]');
    const removeOneFlatWhiteButton = page.locator('[aria-label="Remove one Flat White"]');

    await page.goto(baseUrl);
    await flatWhiteItem.click();
    await expect(checkoutButton).toContainText('Total: $18.00');
    await checkoutButton.hover();
    await addOneFlatWhiteButton.click();
    await expect(checkoutButton).toContainText('Total: $36.00');
    await removeOneFlatWhiteButton.click();
    await expect(checkoutButton).toContainText('Total: $18.00');
  });

  test('Removing coffee from cart', async ({ page }) => {
    const americanoItem = page.locator('[data-test="Americano"]');
    const cartPageLink = page.locator('[aria-label="Cart page"]');
    const americanoCartItem = page.locator('div').filter({ hasText: /^Americano$/ });
    const appContainer = page.locator('#app');
    const deleteButton = page.locator('.list-item .delete');
    const emptyCartMessage = page.locator('.list p:has-text("No coffee, go add some.")');

    await page.goto(baseUrl);
    await americanoItem.click();
    await cartPageLink.click();
    await expect(americanoCartItem).toBeVisible();
    await expect(appContainer).toContainText('Americano');
    await deleteButton.click();
    await expect(emptyCartMessage).toBeVisible();
  });
});
