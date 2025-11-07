Below is a tight, standards-driven rule book updated for **class-based POM + class-based object-repo**, followed by **minimal setup** and **sample implementation** including **custom Cypress commands**. Copy/paste and ship.

# Rule Book — Class-Based POM + Object-Repo (Minimal)

## Folder Contract

* **fixtures/**: JSON-only test data.
* **object-repo/**: classes exposing selector getters; no selectors elsewhere.
* **pages/**: classes exposing user verbs; import object-repo; return Cypress chains; no inline selectors.
* **e2e/**: specs orchestrating pages and fixtures; assertions live here.

## Selector Policy (strict priority)

1. `data-testid`
2. `id` (immutable only)
3. Scoped parent → child (`within()` / page root scoping)
4. `href` (anchors only, stable paths)
   Fallback: **parent `id` + child semantic class**.
   Never: dynamic text, nth-child, index-based, framework-generated classes.

## Spec Structure

```
imports

// Variables:
const = immutable
let   = will/might change

describe()
  before()       // fixtures aliasing, seeds
  beforeEach()   // deterministic start state
  it()           // one behavior per test
  afterEach()    // cleanup/logging
  after()        // teardown
```

## Execution Discipline

* Pages call **custom commands** and consume **object-repo** classes—no raw `cy.get()` in specs.
* Each `it()` is independent; no cross-test coupling.
* Use `cy.intercept()` for critical network contracts; no `cy.wait(ms)`.

---

# Environment Setup (pnpm + Cypress)

## 1) Install and scripts

```bash
pnpm add -D cypress
```

```json
// package.json
{
  "scripts": {
    "test:open": "cypress open",
    "test:run": "cypress run --browser chrome",
    "test:headed": "cypress run --browser chrome --headed"
  },
  "devDependencies": { "cypress": "^13.13.0" },
  "packageManager": "pnpm@9.0.0"
}
```

## 2) Baseline config

```js
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 8000,
    video: true
  }
});
```

## 3) Project layout

```
cypress/
  fixtures/
    user.json
  object-repo/
    Login.repo.js
  pages/
    Login.page.js
  support/
    commands.js
    e2e.js
  e2e/
    login.cy.js
```

## 4) Register global commands and bootstrap

```js
// cypress/support/commands.js
// ---- Selector helpers enforcing your policy ----
Cypress.Commands.add('getByTestId', (id, options = {}) =>
  cy.get(`[data-testid="${id}"]`, options)
);

Cypress.Commands.add('getById', (id, options = {}) =>
  cy.get(`#${id}`, options)
);

Cypress.Commands.add('getWithin', (parentSelector, childSelector, options = {}) =>
  cy.get(parentSelector).within(() => cy.get(childSelector, options))
);

// Fallback: parent id + child class (last resort)
Cypress.Commands.add('getByParentIdAndChildClass', (parentId, childClass, options = {}) =>
  cy.get(`#${parentId} .${childClass}`, options)
);

// ---- Session helpers (optional) ----
let LOCAL_STORAGE_BUFFER = {};
Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach(k => (LOCAL_STORAGE_BUFFER[k] = localStorage[k]));
});
Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_BUFFER).forEach(k => localStorage.setItem(k, LOCAL_STORAGE_BUFFER[k]));
});

// ---- Domain command: login via API (example) ----
Cypress.Commands.add('apiLogin', (email, password) => {
  return cy.request('POST', `${Cypress.env('API_URL') || ''}/api/login`, { email, password })
    .its('status').should('be.oneOf', [200, 204]);
});
```

```js
// cypress/support/e2e.js
import './commands';

Cypress.on('uncaught:exception', (err) => {
  if (err.message && err.message.includes('ResizeObserver')) return false;
});
```

---

# Sample Implementation (Class-based Object-Repo + Page + Spec)

## fixtures

```json
// cypress/fixtures/user.json
{
  "valid": { "email": "qa@example.com", "password": "Password123!" },
  "invalid": { "email": "qa@example.com", "password": "wrong-password" }
}
```

## object-repo (class with selector getters)

```js
// cypress/object-repo/Login.repo.js
export class LoginRepo {
  // Priority 1: data-testids
  get form()     { return '[data-testid="login-form"]'; }
  get username() { return '[data-testid="login-username"]'; }
  get password() { return '[data-testid="login-password"]'; }
  get submit()   { return '[data-testid="login-submit"]'; }
  get error()    { return '[data-testid="login-error"]'; }

  // Priority 2: id (immutable fallback)
  get altUsername() { return '#username'; }
  get altPassword() { return '#password'; }

  // Priority 4: href (anchors only)
  get forgotLink()  { return 'a[href="/forgot-password"]'; }

  // Fallback: parent id + child class
  get fallbackSubmitParentId() { return 'login-form'; }
  get fallbackSubmitClass()    { return 'submit-button'; }
}
```

## page (class consuming object-repo + commands)

```js
// cypress/pages/Login.page.js
import { LoginRepo } from '../object-repo/Login.repo';

export class LoginPage {
  constructor() {
    this.repo = new LoginRepo();
  }

  visit() {
    cy.visit('/login');
    return cy.get(this.repo.form).should('be.visible');
  }

  typeUsername(value) {
    return cy.get('body').then(($b) => {
      if ($b.find(this.repo.username).length) {
        cy.get(this.repo.username).clear().type(value);
      } else {
        cy.get(this.repo.altUsername).clear().type(value);
      }
    });
  }

  typePassword(value) {
    return cy.get('body').then(($b) => {
      if ($b.find(this.repo.password).length) {
        cy.get(this.repo.password).clear().type(value);
      } else {
        cy.get(this.repo.altPassword).clear().type(value);
      }
    });
  }

  submit() {
    return cy.get('body').then(($b) => {
      if ($b.find(this.repo.submit).length) {
        cy.get(this.repo.submit).click();
        return;
      }
      cy.getWithin(this.repo.form, 'button[type="submit"]'); // scoped parent → child
      // if the scoped button didn’t exist, use the last-resort fallback
      cy.getByParentIdAndChildClass(
        this.repo.fallbackSubmitParentId,
        this.repo.fallbackSubmitClass
      ).click();
    });
  }

  expectErrorVisible() {
    return cy.get(this.repo.error).should('be.visible');
  }

  clickForgotPassword() {
    return cy.get(this.repo.forgotLink).click();
  }
}
```

## spec (imports fixtures + pages; assertions here)

```js
// cypress/e2e/login.cy.js
/// <reference types="cypress" />
import { LoginPage } from '../pages/Login.page';

describe('Login Flow — Class POM + Class Object-Repo', () => {
  const page = new LoginPage(); // const: immutable
  let attempts = 0;             // let: will change

  before(() => {
    cy.fixture('user').as('userData'); // load JSON once
  });

  beforeEach(function () {
    attempts += 1;
    page.visit();
  });

  it('authenticates with valid credentials', function () {
    cy.intercept('POST', '**/api/login').as('login');

    page.typeUsername(this.userData.valid.email);
    page.typePassword(this.userData.valid.password);
    page.submit();

    cy.wait('@login').its('response.statusCode').should('be.oneOf', [200, 204]);
    cy.url().should('include', '/dashboard');
  });

  it('rejects invalid credentials and shows error', function () {
    cy.intercept('POST', '**/api/login').as('login');

    page.typeUsername(this.userData.invalid.email);
    page.typePassword(this.userData.invalid.password);
    page.submit();

    cy.wait('@login').its('response.statusCode').should('be.oneOf', [400, 401]);
    page.expectErrorVisible();
  });

  afterEach(() => {
    cy.log(`Attempt #${attempts}`);
  });

  after(() => {
    // teardown if needed
  });
});
```

---

# Run Commands (CI-friendly)

```bash
pnpm run test:open     # interactive
pnpm run test:run      # headless chrome
pnpm run test:headed   # headed chrome
```

This delivers a compliant, class-first POM with a class-based object-repo, hardened selector policy, global custom commands, and an executable sample spec.
