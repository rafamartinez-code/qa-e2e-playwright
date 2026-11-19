export class InventoryPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  /**
   * Converte o nome exibido no data-test usado pelo site.
   * Ex.: "Sauce Labs Backpack" -> "add-to-cart-sauce-labs-backpack"
   */
  static slug(productName) {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  async addToCart(productName) {
    await this.page.getByTestId(`add-to-cart-${InventoryPage.slug(productName)}`).click();
  }

  removeButton(productName) {
    return this.page.getByTestId(`remove-${InventoryPage.slug(productName)}`);
  }

  async openCart() {
    await this.cartLink.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
