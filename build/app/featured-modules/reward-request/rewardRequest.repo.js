"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rewardRequest_schema_1 = require("./rewardRequest.schema");
const find = (filter) => rewardRequest_schema_1.rewardRequestModel.find(Object.assign({ isDeleted: false }, filter));
const findOne = (filter) => rewardRequest_schema_1.rewardRequestModel.findOne(Object.assign({ isDeleted: false }, filter));
const add = (rewardRequest) => rewardRequest_schema_1.rewardRequestModel.create(rewardRequest);
const update = (filter, data) => {
    return rewardRequest_schema_1.rewardRequestModel.updateMany(filter, data);
};
const aggregation = (pipeline) => rewardRequest_schema_1.rewardRequestModel.aggregate(pipeline);
exports.default = {
    find,
    findOne,
    add,
    update,
    aggregation
};
