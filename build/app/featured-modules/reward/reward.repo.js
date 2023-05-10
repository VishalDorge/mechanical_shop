"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reward_schema_1 = require("./reward.schema");
const find = (filter) => reward_schema_1.rewardModel.find(Object.assign({ isDeleted: false }, filter));
const findOne = (filter) => reward_schema_1.rewardModel.findOne(Object.assign({ isDeleted: false }, filter));
const add = (reward) => reward_schema_1.rewardModel.create(reward);
const update = (filter, data) => {
    return reward_schema_1.rewardModel.updateMany(filter, data);
};
const aggregation = (pipeline) => {
    return reward_schema_1.rewardModel.aggregate(pipeline);
};
exports.default = {
    find,
    findOne,
    add,
    update,
    aggregation
};
