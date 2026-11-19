export class CheckoutPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    // Etapa 1: dados do comprador
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');
    // Etapa 2: resumo do pedido
    this.itemNames = page.getByTestId('inventory-item-name');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    // Etapa 3: confirmação
    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillCustomerInfo({ firstName, lastName, postalCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}
