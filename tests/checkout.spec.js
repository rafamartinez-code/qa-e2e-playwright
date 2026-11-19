import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { users, PASSWORD, customer } from '../data/users.js';

test.describe('Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await new CartPage(page).checkout();
  });

  test('fluxo completo termina com a confirmação do pedido', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await expect(checkoutPage.title).toHaveText('Checkout: Your Information');
    await checkoutPage.fillCustomerInfo(customer);

    await expect(checkoutPage.title).toHaveText('Checkout: Overview');
    await expect(checkoutPage.itemNames).toHaveText(['Sauce Labs Backpack']);
    // Item de $29.99 + 8% de imposto ($2.40)
    await expect(checkoutPage.totalLabel).toHaveText('Total: $32.39');

    await checkoutPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
    await expect(new InventoryPage(page).cartBadge).toBeHidden();
  });

  test('não avança sem o primeiro nome e exibe erro de campo obrigatório', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    await checkoutPage.fillCustomerInfo({ ...customer, firstName: '' });

    await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
    await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
  });
});
