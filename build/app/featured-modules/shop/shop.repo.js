"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shop_schema_1 = require("./shop.schema");
const find = (filter) => shop_schema_1.shopModel.find(Object.assign({ isDeleted: false }, filter));
const findOne = (filter) => shop_schema_1.shopModel.findOne(Object.assign({ isDeleted: false }, filter));
const add = (Shop) => shop_schema_1.shopModel.create(Shop);
const update = (filter, data) => {
    return shop_schema_1.shopModel.updateMany(filter, data);
};
const aggregation = (pipeline) => {
    return shop_schema_1.shopModel.aggregate(pipeline);
};
exports.default = {
    find,
    findOne,
    add,
    update,
    aggregation
};
