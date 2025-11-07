// pages/createUser.page.js
import { createUserRepo } from '../object-repo/createUser.repo';

export function uniquifyUser(base, { seed = 0, emailMode = 'suffix' } = {}) {
  const t = Date.now().toString().slice(-6);
  const s = (seed % 100).toString().padStart(2, '0');
  const suffix = `${t}${s}`;

  // ---- Email without '+' ----
  const atIdx = base.email.indexOf('@');
  const rawLocal = base.email.slice(0, atIdx);
  const domain = base.email.slice(atIdx + 1);

  const localNoPlus = rawLocal.split('+')[0];
  const localSafe = localNoPlus.replace(/[^A-Za-z0-9._-]/g, '');

  const email =
    emailMode === 'suffix'
      ? `${localSafe}_${suffix}@${domain}`
      : `${localSafe}@${domain}`; 
      
  // Username
  const baseUser = String(base.username || `${base.firstName}${base.lastName}` || 'user')
    .replace(/\W/g, '')
    .toLowerCase();
  const username = `${baseUser}_${suffix}`.slice(0, 30);

  // Phone
  const digits = String(base.phone || '').replace(/\D/g, '').padStart(10, '0');
  const phone = (digits.slice(0, 4) + suffix).slice(-10);

  const password = base.password && base.password.length > 0
    ? base.password
    : `P@ssw0rd!${suffix}`;

  return { ...base, email, username, phone, password };
}

export function pickRandom(arr = []) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('Fixture array is empty or invalid');
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

export class createUserPage {
  constructor() {
    this.select = new createUserRepo();
  }
  navigateToUserList() {
    cy.get(this.select.userMenuDropdown).click();
    cy.get(this.select.userListNavMenu).click();
  }
  clickAddUser() {
    cy.wait(1000);
    cy.get(this.select.addUserButton).click();
  }
  enterEmail(email) {
    cy.get(this.select.emailInputField).type(email);
  }
  enterUsername(username) {
    cy.get(this.select.userNameInputField).clear().type(username);
  }
  enterFirstName(firstName) {
    cy.get(this.select.firstNameInputField).type(firstName);
  }
  enterLastName(lastName) {
    cy.get(this.select.lastNameInputField).type(lastName);
  }
  enterPhone(phone) {
    cy.get(this.select.phoneInputField).clear().type(phone);
  }
  enterPassword(password) {
    cy.get(this.select.passwordInputField).type(password);
  }
  submitCreateUser() {
    cy.get(this.select.createUserSubmitButton).click();
  }
}
