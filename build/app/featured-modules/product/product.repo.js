"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_schema_1 = require("./product.schema");
const find = (filter) => product_schema_1.productModel.find(Object.assign({ isDeleted: false }, filter));
const findOne = (filter) => product_schema_1.productModel.findOne(Object.assign({ isDeleted: false }, filter));
const aggregation = (pipeline) => {
    return product_schema_1.productModel.aggregate(pipeline);
};
const add = (product) => product_schema_1.productModel.create(product);
const update = (filter, data) => {
    return product_schema_1.productModel.updateMany(filter, data);
};
exports.default = {
    find,
    findOne,
    add,
    update,
    aggregation
};
