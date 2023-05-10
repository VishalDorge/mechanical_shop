"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const status_schema_1 = require("./status.schema");
const findOne = (filter) => status_schema_1.statusModel.findOne(filter);
const add = (status) => status_schema_1.statusModel.create(status);
exports.default = {
    findOne, add
};
