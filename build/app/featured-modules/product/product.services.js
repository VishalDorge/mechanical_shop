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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_repo_1 = __importDefault(require("./product.repo"));
const product_responses_1 = require("./product.responses");
const generate_pipeline_1 = require("../../utility/generate.pipeline");
const findOne = (filter) => product_repo_1.default.findOne(filter);
const find = (query) => {
    const pipeline = new generate_pipeline_1.CustomPipeline(query).generate();
    // const pipeline: PipelineStage[] = [];
    // const {page, limit, sortBy, sortOrder, ...filter} = query;
    // convertValuesToOriginalType(filter);
    // const pipeline = new CustomPipeline(filter)
    // .matchStage(filter)
    // .sortingStage(sortBy, sortOrder)
    // .pagination(page || 1, limit || 3)
    // .generate();
    // generatePipeline.matchStage(filter, pipeline);
    // generatePipeline.sortingStage(sortBy, sortOrder, pipeline);
    // generatePipeline.pagination(page || 1, limit || 3, pipeline);
    if (pipeline.length === 0)
        pipeline.push({ $match: {} });
    return product_repo_1.default.aggregation(pipeline);
};
const add = (product) => {
    product.points ? product.isSpecial = true : product.isSpecial = false;
    return product_repo_1.default.add(product);
};
const update = (filter, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_repo_1.default.update(filter, data);
    if (result.modifiedCount <= 0)
        throw product_responses_1.ProductResponses.UNABLE_TO_PROCEED;
    return product_responses_1.ProductResponses.UPDATE_SUCCESS;
});
const remove = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_repo_1.default.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0)
        throw product_responses_1.ProductResponses.UNABLE_TO_PROCEED;
    return product_responses_1.ProductResponses.DELETE_SUCCESS;
});
exports.default = {
    find,
    findOne,
    add,
    update,
    remove
};
