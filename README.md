# qa-e2e-playwright

![Playwright Tests](https://github.com/rafamartinez-code/qa-e2e-playwright/actions/workflows/playwright.yml/badge.svg)

Testes end-to-end (E2E) com **Playwright + JavaScript** no [SauceDemo](https://www.saucedemo.com), e-commerce público mantido pela Sauce Labs para treino de automação. O projeto usa **Page Object Model (POM)** e roda a cada push no GitHub Actions.

## Objetivo

Automatizar os fluxos críticos de uma loja virtual (autenticação, carrinho, checkout e logout) com testes independentes, legíveis e estáveis, que possam entrar numa suíte de regressão.

## Estrutura

```
.
├── .github/workflows/playwright.yml   # CI: roda a suíte a cada push e pull request
├── data/
│   └── users.js                       # credenciais públicas do site e dados do comprador
├── pages/                             # Page Objects: seletores e ações de cada tela
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/                             # specs: só cenários e asserções
│   ├── login.spec.js
│   ├── cart.spec.js
│   ├── checkout.spec.js
│   └── logout.spec.js
└── playwright.config.js
```

## Cenários cobertos

| # | Arquivo | Cenário | O que é validado |
|---|---------|---------|------------------|
| 1 | `login.spec.js` | Login com sucesso (`standard_user`) | URL `/inventory.html`, título "Products" e 6 produtos listados |
| 2 | `login.spec.js` | Login com usuário bloqueado (`locked_out_user`) | Mensagem de erro exata e permanência na tela de login |
| 3 | `cart.spec.js` | Adicionar produto ao carrinho | Contador do carrinho = 1, botão muda para "Remove", item listado no carrinho |
| 4 | `checkout.spec.js` | Checkout completo | Resumo com o item e total de $32.39, confirmação "Thank you for your order!" e carrinho zerado |
| 5 | `checkout.spec.js` | Checkout sem primeiro nome (negativo) | Erro "First Name is required" e bloqueio na etapa 1 |
| 6 | `logout.spec.js` | Logout pelo menu lateral | Retorno à tela de login |
| 7 | `logout.spec.js` | Acesso à página protegida após logout (negativo) | Mensagem de acesso negado ao abrir `/inventory.html` pela URL |

## Decisões técnicas

- **Seletores `data-test`**: o SauceDemo expõe `data-test` nos elementos. A config define `testIdAttribute: 'data-test'`, então os Page Objects usam `page.getByTestId(...)`, mais estável que CSS por classe ou XPath. Os seletores foram tirados do próprio site.
- **Testes independentes**: cada teste faz o próprio login, sem depender da ordem de execução, o que permite rodar em paralelo.
- **Esperas automáticas**: nenhuma espera fixa (`waitForTimeout`); as asserções `expect(...)` do Playwright aguardam o estado esperado.
- **Evidência de falha**: screenshot em toda falha e trace na primeira retentativa no CI.

## Como rodar

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npx playwright install chromium
npx playwright test
```

Outros comandos úteis:

```bash
npm run test:headed   # abre o navegador durante a execução
npm run test:ui       # modo interativo do Playwright
npm run report        # abre o relatório HTML da última execução
```
