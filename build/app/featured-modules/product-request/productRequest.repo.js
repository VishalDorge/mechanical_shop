"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const productRequest_schema_1 = require("./productRequest.schema");
const find = (filter) => productRequest_schema_1.productRequestModel.find(Object.assign({ isDeleted: false }, filter));
const findOne = (filter) => productRequest_schema_1.productRequestModel.findOne(Object.assign({ isDeleted: false }, filter));
const add = (productRequest) => productRequest_schema_1.productRequestModel.create(productRequest);
const update = (filter, data) => {
    return productRequest_schema_1.productRequestModel.updateMany(filter, data);
};
const aggregation = (pipeline) => productRequest_schema_1.productRequestModel.aggregate(pipeline);
exports.default = {
    find,
    findOne,
    add,
    update,
    aggregation
};
