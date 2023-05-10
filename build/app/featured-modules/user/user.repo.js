"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_schema_1 = require("./user.schema");
const find = (filter) => user_schema_1.userModel.find(Object.assign({ isDeleted: false }, filter));
const findOne = (filter) => user_schema_1.userModel.findOne(Object.assign({ isDeleted: false }, filter));
const add = (user) => user_schema_1.userModel.create(user);
const update = (filter, data) => user_schema_1.userModel.updateMany(Object.assign({ isDeleted: false }, filter), data);
const aggregation = (pipeline) => user_schema_1.userModel.aggregate(pipeline);
exports.default = {
    find,
    findOne,
    add,
    update,
    aggregation
};
