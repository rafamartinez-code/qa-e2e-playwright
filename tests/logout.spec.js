import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { users, PASSWORD } from '../data/users.js';

test.describe('Logout', () => {
  test('logout pelo menu lateral volta para a tela de login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);
    await expect(inventoryPage.title).toHaveText('Products');

    await inventoryPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('após o logout, a página protegida não pode ser acessada pela URL', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);
    await inventoryPage.logout();

    await page.goto('/inventory.html');

    await expect(loginPage.errorMessage).toHaveText(
      "Epic sadface: You can only access '/inventory.html' when you are logged in."
    );
  });
});
