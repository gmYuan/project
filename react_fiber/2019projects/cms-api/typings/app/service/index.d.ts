// This file is created by egg-ts-helper@1.25.5
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBase = require('../../../app/service/base');
import ExportResource = require('../../../app/service/resource');
import ExportRole = require('../../../app/service/role');
import ExportRoleResource = require('../../../app/service/roleResource');
import ExportRoleUser = require('../../../app/service/roleUser');
import ExportUser = require('../../../app/service/user');

declare module 'egg' {
  interface IService {
    base: ExportBase;
    resource: ExportResource;
    role: ExportRole;
    roleResource: ExportRoleResource;
    roleUser: ExportRoleUser;
    user: ExportUser;
  }
}
