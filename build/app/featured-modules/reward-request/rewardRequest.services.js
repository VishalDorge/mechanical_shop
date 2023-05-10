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
const rewardRequest_repo_1 = __importDefault(require("./rewardRequest.repo"));
const rewardRequest_responses_1 = require("./rewardRequest.responses");
const shop_services_1 = __importDefault(require("../shop/shop.services"));
const reward_services_1 = __importDefault(require("../reward/reward.services"));
const user_services_1 = __importDefault(require("../user/user.services"));
const convert_1 = require("../../utility/convert");
const generate_pipeline_1 = __importDefault(require("../../utility/generate.pipeline"));
const findOne = (filter) => rewardRequest_repo_1.default.findOne(filter);
const add = (ownerId, rewardId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_services_1.default.findOne({ owner: ownerId });
    if (!shop)
        throw rewardRequest_responses_1.RewardRequestResponses.INVALID_OWNER;
    const reward = yield reward_services_1.default.findOne({ _id: rewardId });
    if (!reward)
        throw rewardRequest_responses_1.RewardRequestResponses.UNABLE_TO_PROCEED;
    const owner = yield user_services_1.default.findOne({ _id: ownerId });
    if (reward.points > ((owner === null || owner === void 0 ? void 0 : owner.points) || 0)) {
        throw rewardRequest_responses_1.RewardRequestResponses.INSUFFICIENT_BALANCE;
    }
    else {
        const rewardRequest = {
            shopId: shop._id,
            rewardId,
            pointsAtTimeOfRequest: reward.points
        };
        yield user_services_1.default.update({ _id: ownerId }, { $inc: { points: reward.points * -1 } });
        return rewardRequest_repo_1.default.add(rewardRequest);
    }
});
const cancleRequest = (rewardRequestId) => __awaiter(void 0, void 0, void 0, function* () {
    const rewardRequest = yield findOne({ _id: rewardRequestId, isApproved: false });
    if (!rewardRequest)
        throw rewardRequest_responses_1.RewardRequestResponses.NO_PENDING_REQUEST_FOUND;
    const shop = yield shop_services_1.default.findOne({ _id: rewardRequest.shopId });
    const reward = yield reward_services_1.default.findOne({ _id: rewardRequest.rewardId });
    yield user_services_1.default.update({ _id: shop === null || shop === void 0 ? void 0 : shop.owner }, { $inc: { points: rewardRequest === null || rewardRequest === void 0 ? void 0 : rewardRequest.pointsAtTimeOfRequest } });
    return yield remove({ _id: rewardRequestId });
});
const update = (filter, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rewardRequest_repo_1.default.update(filter, data);
    if (result.modifiedCount <= 0)
        throw rewardRequest_responses_1.RewardRequestResponses.UNABLE_TO_PROCEED;
    return rewardRequest_responses_1.RewardRequestResponses.UPDATE_SUCCESS;
});
const remove = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield rewardRequest_repo_1.default.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0)
        throw rewardRequest_responses_1.RewardRequestResponses.UNABLE_TO_PROCEED;
    return rewardRequest_responses_1.RewardRequestResponses.DELETE_SUCCESS;
});
const find = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [];
    const { page, limit, sortBy, sortOrder } = query, filter = __rest(query, ["page", "limit", "sortBy", "sortOrder"]);
    (0, convert_1.convertValuesToOriginalType)(filter);
    generate_pipeline_1.default.matchStage(filter, pipeline);
    generate_pipeline_1.default.lookupStage("shops", "shopId", "_id", "shop", pipeline);
    generate_pipeline_1.default.lookupStage("rewards", "rewardId", "_id", "reward", pipeline);
    generate_pipeline_1.default.selectStage(pipeline, "shopId", "rewardId");
    generate_pipeline_1.default.sortingStage(sortBy, sortOrder, pipeline);
    generate_pipeline_1.default.pagination(page || 1, limit || 3, pipeline);
    if (pipeline.length === 0)
        pipeline.push({ $match: {} });
    return rewardRequest_repo_1.default.aggregation(pipeline);
});
const approveRequest = (requestId) => {
    return update({ _id: requestId, isApproved: false, isDeleted: false }, { isApproved: true });
};
const rewardHistory = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [];
    const { page, limit, sortBy, sortOrder } = query, filter = __rest(query, ["page", "limit", "sortBy", "sortOrder"]);
    (0, convert_1.convertValuesToOriginalType)(filter);
    generate_pipeline_1.default.matchStage(Object.assign({ isApproved: true }, filter), pipeline);
    generate_pipeline_1.default.lookupStage("rewards", "rewardId", "_id", "reward", pipeline);
    generate_pipeline_1.default.selectStage(pipeline, "rewardId");
    generate_pipeline_1.default.sortingStage(sortBy, sortOrder, pipeline);
    generate_pipeline_1.default.pagination(page || 1, limit || 3, pipeline);
    return yield rewardRequest_repo_1.default.aggregation(pipeline);
});
exports.default = {
    find,
    findOne,
    add,
    update,
    remove,
    approveRequest,
    rewardHistory,
    cancleRequest
};
