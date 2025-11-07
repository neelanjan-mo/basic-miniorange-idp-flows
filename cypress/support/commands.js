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
