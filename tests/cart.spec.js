import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { users, PASSWORD } from '../data/users.js';

test.describe('Carrinho', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);
  });

  test('adicionar produto atualiza o contador e o item aparece no carrinho', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const product = 'Sauce Labs Backpack';

    await expect(inventoryPage.cartBadge).toBeHidden();

    await inventoryPage.addToCart(product);

    await expect(inventoryPage.cartBadge).toHaveText('1');
    await expect(inventoryPage.removeButton(product)).toBeVisible();

    await inventoryPage.openCart();

    await expect(cartPage.title).toHaveText('Your Cart');
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText([product]);
  });
});
