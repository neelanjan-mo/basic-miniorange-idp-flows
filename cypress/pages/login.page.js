import {loginRepo} from "../object-repo/login.repo"

export class loginPage {
    
    constructor() {
        this.select = new loginRepo();
    }

    visit(url) {
        cy.log("Visiting URL: " + url);
        cy.visit(url);
    }
    
    enterUsername(username) {
        cy.log("Entering Username: " + username);
        cy.get(this.select.username).type(username);
    }
    
    enterPassword(password) {
        cy.log("Entering Password");
        cy.get(this.select.password).type(password);
    }

    clickLogin() {
        cy.log("Clicking Login Button");
        cy.get(this.select.loginButton).click();
    }
}