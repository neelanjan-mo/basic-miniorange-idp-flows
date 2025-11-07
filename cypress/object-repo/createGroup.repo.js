// Single source of truth for selectors (upgrade to data-testid when available)
export class GroupsRepo {
  // Trigger to open Create Group
  get createGroupBtn() { return 'a.btn.mo-btn-primary.btn-md[href="creategroup"]'; }

  // Create Group form controls
  get groupNameInput() { return '#groupName'; }
  get saveBtn()        { return '#save'; }

  // Optional anchors for route checks
  get createGroupPath() { return '/moas/admin/customer/creategroup'; }
  get groupsListPath()  { return '/moas/admin/customer/getgroups'; }
}
