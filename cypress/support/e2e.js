import './commands';

window.addEventListener('unhandledrejection', (e) => {
  if (String(e.reason?.message || e.reason).includes('detectIncognito cannot determine the browser')) {
    e.preventDefault();
  }
});

// Filter the specific exception so other real errors still fail tests
Cypress.on('uncaught:exception', (err) => {
  if (err?.message?.includes('detectIncognito cannot determine the browser')) {
    return false; // prevent Cypress from failing the test
  }
  // let everything else fail the test
});

// Also neutralize unhandled promise rejections with this message
Cypress.on('window:before:load', (win) => {
  win.addEventListener('unhandledrejection', (e) => {
    const reason = String(e?.reason?.message || e?.reason || '');
    if (reason.includes('detectIncognito cannot determine the browser')) {
      e.preventDefault();
    }
  });

  // If the library attaches a global, stub it to a resolved value
  if ('detectIncognito' in win && typeof (win).detectIncognito === 'function') {
    (win).detectIncognito = () =>
      Promise.resolve({ isPrivate: false, browserName: 'cypress' });
  }
});

Cypress.on('uncaught:exception', (err) => {
  // Only silence this specific, known error
  if (/can't access property "data".*response is undefined/i.test(err.message)) {
    return false; // prevent test failure
  }
});
