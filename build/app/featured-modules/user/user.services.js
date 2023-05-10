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
const user_repo_1 = __importDefault(require("./user.repo"));
const user_responses_1 = require("./user.responses");
const generate_pipeline_1 = __importDefault(require("../../utility/generate.pipeline"));
const convert_1 = require("../../utility/convert");
const find = (query) => {
    const pipeline = [];
    const { page, limit, sortBy, sortOrder } = query, filter = __rest(query, ["page", "limit", "sortBy", "sortOrder"]);
    (0, convert_1.convertValuesToOriginalType)(filter);
    generate_pipeline_1.default.matchStage(filter, pipeline);
    generate_pipeline_1.default.sortingStage(sortBy, sortOrder, pipeline);
    generate_pipeline_1.default.pagination(page || 1, limit || 3, pipeline);
    return user_repo_1.default.aggregation(pipeline);
};
const findOne = (filter) => user_repo_1.default.findOne(filter);
const add = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldUser = yield user_repo_1.default.findOne({ email: user.email });
        if (oldUser)
            throw user_responses_1.UserResponses.USER_ALREADY_EXIST;
        return user_repo_1.default.add(user);
    }
    catch (err) {
        throw err;
    }
});
const update = (filter, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_repo_1.default.update(filter, data);
    if (result.modifiedCount >= 0)
        return user_responses_1.UserResponses.UPADATE_SUCCESS;
    else
        throw user_responses_1.UserResponses.COULD_NOT_PROCEED;
});
const pointLeaders = (query) => {
    (0, convert_1.convertValuesToOriginalType)(query);
    const { page, limit, sortBy, sortOrder } = query, filter = __rest(query, ["page", "limit", "sortBy", "sortOrder"]);
    const pipeline = [];
    generate_pipeline_1.default.matchStage(filter, pipeline);
    pipeline.push({
        $group: {
            _id: "$email",
            points: { $sum: "$points" }
        }
    });
    generate_pipeline_1.default.sortingStage(sortBy, sortOrder, pipeline);
    generate_pipeline_1.default.pagination(page || 1, limit || 10, pipeline);
    return user_repo_1.default.aggregation(pipeline);
};
const remove = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_repo_1.default.update(filter, { isDeleted: true });
    if (result.modifiedCount > 0)
        return user_responses_1.UserResponses.DELETE_SUCCESS;
    else
        throw user_responses_1.UserResponses.COULD_NOT_PROCEED;
});
exports.default = {
    find,
    findOne,
    update,
    remove,
    add,
    pointLeaders
};
