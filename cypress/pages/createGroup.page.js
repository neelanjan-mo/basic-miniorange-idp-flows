import { GroupsRepo } from '../object-repo/Groups.repo';

export class GroupsPage {
  constructor() {
    this.repo = new GroupsRepo();
  }

  openCreateGroupFromManage() {
    cy.log('GroupsPage: open Create Group');
    return cy
      .get(this.repo.createGroupBtn, { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });
  }

  typeGroupName(groupName) {
    cy.log('GroupsPage: type group name');
    return cy
      .get(this.repo.groupNameInput)
      .should('be.visible')
      .clear()
      .type(groupName);
  }

  submitCreateGroup() {
    cy.log('GroupsPage: submit create group');
    return cy.get(this.repo.saveBtn).should('be.enabled').click({ force: true });
  }
}
