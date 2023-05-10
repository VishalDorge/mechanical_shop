"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_schema_1 = require("./role.schema");
const findOne = (filter) => role_schema_1.roleModel.findOne(filter);
const add = (role) => role_schema_1.roleModel.create(role);
exports.default = {
    findOne, add
};
