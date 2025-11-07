export class createUserRepo {
    get userMenuDropdown() {
        return '[data-testid="users-menu-link"]';
    }

    get userListNavMenu() {
        return '[data-testid="sidebar-user-list-link"]';
    }

    get addUserButton() {
        return '#quickAccessDiv #button2';
    }

    get emailInputField() {
        return '#primaryEmail';
    }

    get userNameInputField() {
        return '#username';
    }

    get firstNameInputField() {
        return '#fname';
    }
    
    get lastNameInputField() {
        return '#lname';
    }

    get phoneInputField() {
        return '#primaryPhone';
    }

    get passwordInputField() {
        return '#password';
    }

    get createUserSubmitButton() {
        return '#save';
    }
}