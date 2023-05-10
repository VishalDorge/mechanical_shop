"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inventory_schema_1 = require("./inventory.schema");
const find = (filter) => inventory_schema_1.inventoryModel.find(Object.assign({ isDeleted: false }, filter));
const findOne = (filter) => inventory_schema_1.inventoryModel.findOne(Object.assign({ isDeleted: false }, filter));
const add = (inventory) => inventory_schema_1.inventoryModel.create(inventory);
const update = (filter, data, options = []) => inventory_schema_1.inventoryModel.updateMany(filter, data, options);
const aggregation = (pipeline) => inventory_schema_1.inventoryModel.aggregate(pipeline);
exports.default = {
    find,
    findOne,
    add,
    update,
    aggregation
};
