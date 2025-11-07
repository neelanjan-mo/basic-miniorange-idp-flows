import { loginPage } from "../pages/login.page";
import { createUserPage, uniquifyUser, pickRandom } from "../pages/createUser.page";
import loginData from "../fixtures/login-data.json";
import createUserData from "../fixtures/create-user-data.json";

let chosenUser; // module-scoped cache

describe("Create User Flow (single random record per run)", () => {
  const loginPageObj = new loginPage();
  const createUserPageObj = new createUserPage();
  const validData = loginData[0].valid;

  // Compute once per spec run; persist via Cypress.env for stability on retries
  before(() => {
    if (!chosenUser) {
      const base = pickRandom(createUserData);
      chosenUser = uniquifyUser(base); // add uniqueness while honoring fixture source
      Cypress.env("chosenUser", chosenUser);
    }
  });

  beforeEach(() => {
    // read from env to keep the same selection on retries
    chosenUser = Cypress.env("chosenUser");

    loginPageObj.visit(loginData[0].url);
    loginPageObj.enterUsername(validData.username);
    loginPageObj.clickLogin();
    loginPageObj.enterPassword(validData.password);
    loginPageObj.clickLogin();
  });

  it("Create User - use the single selected record", () => {
    const cuData = chosenUser;

    createUserPageObj.navigateToUserList();
    createUserPageObj.clickAddUser();
    createUserPageObj.enterEmail(cuData.email);
    createUserPageObj.enterUsername(cuData.username);
    createUserPageObj.enterFirstName(cuData.firstName);
    createUserPageObj.enterLastName(cuData.lastName);
    createUserPageObj.enterPhone(cuData.phone);
    createUserPageObj.enterPassword(cuData.password);
    createUserPageObj.submitCreateUser();
  });
});
