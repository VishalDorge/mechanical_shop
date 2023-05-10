"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sales_schema_1 = require("./sales.schema");
const find = (filter) => sales_schema_1.salesModel.find(Object.assign({ isDeleted: false }, filter));
const findOne = (filter) => sales_schema_1.salesModel.findOne(Object.assign({ isDeleted: false }, filter));
const add = (sales) => sales_schema_1.salesModel.create(sales);
const update = (filter, data) => {
    return sales_schema_1.salesModel.updateMany(filter, data);
};
const aggregation = (pipeline) => sales_schema_1.salesModel.aggregate(pipeline);
const remove = (filter) => sales_schema_1.salesModel.deleteMany(filter);
exports.default = {
    find,
    findOne,
    add,
    update,
    aggregation,
    remove
};
