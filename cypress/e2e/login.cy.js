import { loginPage } from "../pages/login.page";
import data from "../fixtures/login-data.json";

describe("miniOrange Customer Admin Login", () => {
    const page = new loginPage();
    const DATA = data[0];
    const validData = DATA.valid;
    const invalidData = DATA.invalid;

    it(`Logging in with the credentials of ${validData.username}`, () => {
        page.visit(DATA.url);
        page.enterUsername(validData.username);
        page.clickLogin();
        page.enterPassword(validData.password);
        page.clickLogin();
    });
    // it(`Logging in with invalid password for ${invalidData.username}`, () => {
    //     page.visit(DATA.url);
    //     page.enterUsername(invalidData.username);
    //     page.clickLogin();
    //     page.enterPassword(invalidData.password);
    //     page.clickLogin();
    // });
});