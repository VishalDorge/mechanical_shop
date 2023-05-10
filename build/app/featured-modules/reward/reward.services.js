"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reward_repo_1 = __importDefault(require("./reward.repo"));
const reward_responses_1 = require("./reward.responses");
const convert_1 = require("../../utility/convert");
const generate_pipeline_1 = __importDefault(require("../../utility/generate.pipeline"));
const shop_services_1 = __importDefault(require("../shop/shop.services"));
const findOne = (filter) => reward_repo_1.default.findOne(filter);
const add = (reward) => __awaiter(void 0, void 0, void 0, function* () {
    const rewardExist = yield findOne({ name: reward.name });
    if (rewardExist)
        throw reward_responses_1.RewardResponses.REWARD_ALREADY_EXIST;
    return reward_repo_1.default.add(reward);
});
const update = (filter, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reward_repo_1.default.update(filter, data);
    if (result.modifiedCount <= 0)
        throw reward_responses_1.RewardResponses.UNABLE_TO_PROCEED;
    return reward_responses_1.RewardResponses.UPDATE_SUCCESS;
});
const remove = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield reward_repo_1.default.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0)
        throw reward_responses_1.RewardResponses.UNABLE_TO_PROCEED;
    return reward_responses_1.RewardResponses.DELETE_SUCCESS;
});
const find = (query) => {
    const pipeline = [];
    const { page, limit, sortBy, sortOrder } = query, filter = __rest(query, ["page", "limit", "sortBy", "sortOrder"]);
    (0, convert_1.convertValuesToOriginalType)(filter);
    generate_pipeline_1.default.matchStage(filter, pipeline);
    generate_pipeline_1.default.sortingStage(sortBy, sortOrder, pipeline);
    generate_pipeline_1.default.pagination(page || 1, limit || 3, pipeline);
    if (pipeline.length === 0)
        pipeline.push({ $match: {} });
    return reward_repo_1.default.aggregation(pipeline);
};
const currentReward = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_services_1.default.findOne({ owner: ownerId });
    if (!shop)
        throw reward_responses_1.RewardResponses.UNABLE_TO_PROCEED;
    const pipeline = [];
    generate_pipeline_1.default.matchStage({ _id: shop._id }, pipeline);
    generate_pipeline_1.default.lookupStage("users", "owner", "_id", "owner", pipeline);
    const result = yield shop_services_1.default.aggregation(pipeline);
    const currentReward = yield reward_repo_1.default.find({ points: { $lte: result[0].owner[0].points } }).sort({ "_id": 1 });
    const rewardDetails = currentReward.map(reward => {
        return { id: reward._id, name: reward.name, points: reward.points };
    });
    const nextBestReward = yield findOne({ points: { $gt: result[0].owner[0].points } });
    const finalResponse = {
        currentReward: currentReward.length ? rewardDetails : "NA",
        nextBestReward: nextBestReward ? { id: nextBestReward._id, name: nextBestReward.name } : "NA",
        pointsRequired: nextBestReward ? (nextBestReward.points - result[0].owner[0].points) : -1
    };
    return finalResponse;
});
exports.default = {
    find,
    findOne,
    add,
    update,
    remove,
    currentReward
};
