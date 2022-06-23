import { ACLType, ACLDataType } from './acl.dto';

class ACLServiceClass {
  roles: string[] = [];
  permissions: (string | number)[] = [];
  isSuperAdmin = false;

  init() {}

  addRoles(role: string[]) {
    this.roles = [...this.roles, ...role];
  }

  addPermissions(permission: (string | number)[]) {
    this.permissions = [...this.permissions, ...permission];
  }

  private parseACLDataType(val: ACLDataType | null): ACLType {
    let t: ACLType;
    if (typeof val === 'number') {
      t = { ability: [val] };
    } else if (_.isArray(val) && val.length > 0 && typeof val[0] === 'number') {
      t = { ability: val };
    } else if (typeof val === 'object' && !_.isArray(val)) {
      t = { ...val };
    } else if (_.isArray(val)) {
      t = { role: val as string[] };
    } else {
      t = { role: val == null ? [] : [val] };
    }

    return { except: false, ...t };
  }
}

const ACLService = new ACLServiceClass();
export { ACLService };
