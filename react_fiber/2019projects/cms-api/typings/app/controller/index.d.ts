// This file is created by egg-ts-helper@1.25.5
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBase = require('../../../app/controller/base');
import ExportHome = require('../../../app/controller/home');
import ExportIndex = require('../../../app/controller/index');
import ExportResource = require('../../../app/controller/resource');
import ExportRole = require('../../../app/controller/role');
import ExportRoleResource = require('../../../app/controller/roleResource');
import ExportRoleUser = require('../../../app/controller/roleUser');
import ExportUser = require('../../../app/controller/user');

declare module 'egg' {
  interface IController {
    base: ExportBase;
    home: ExportHome;
    index: ExportIndex;
    resource: ExportResource;
    role: ExportRole;
    roleResource: ExportRoleResource;
    roleUser: ExportRoleUser;
    user: ExportUser;
  }
}
