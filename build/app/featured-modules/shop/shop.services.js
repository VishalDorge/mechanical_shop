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
const shop_repo_1 = __importDefault(require("./shop.repo"));
const shop_responses_1 = require("./shop.responses");
const auth_services_1 = __importDefault(require("../auth/auth.services"));
const convert_1 = require("../../utility/convert");
const generate_pipeline_1 = __importDefault(require("../../utility/generate.pipeline"));
const inventory_services_1 = __importDefault(require("../inventory/inventory.services"));
const user_services_1 = __importDefault(require("../user/user.services"));
const findOne = (filter) => shop_repo_1.default.findOne(filter);
const find = (query) => {
    const pipeline = [];
    const { page, limit, sortBy, sortOrder } = query, filter = __rest(query, ["page", "limit", "sortBy", "sortOrder"]);
    (0, convert_1.convertValuesToOriginalType)(filter);
    generate_pipeline_1.default.matchStage(filter, pipeline);
    generate_pipeline_1.default.lookupStage("users", "owner", "_id", "owner", pipeline);
    generate_pipeline_1.default.sortingStage(sortBy, sortOrder, pipeline);
    generate_pipeline_1.default.pagination(page || 1, limit || 3, pipeline);
    if (pipeline.length === 0)
        pipeline.push({ $match: {} });
    return shop_repo_1.default.aggregation(pipeline);
};
const aggregation = (pipeline) => shop_repo_1.default.aggregation(pipeline);
const customerRating = (shopId, newRating) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_repo_1.default.update({ _id: shopId }, { $push: { reviews: newRating } });
    yield shop_repo_1.default.update({ _id: shopId }, [{ $set: { rating: { $round: [{ $avg: "$reviews" }, 1] } } }]);
    if (result.modifiedCount <= 0)
        throw shop_responses_1.ShopResponses.UNABLE_TO_PROCEED;
    return shop_responses_1.ShopResponses.RATING_SUCCESS;
});
const thresholdProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [];
    const { shopId } = query;
    generate_pipeline_1.default.matchStage(shopId ? { _id: shopId } : {}, pipeline);
    generate_pipeline_1.default.lookupStage("inventories", "inventory", "_id", "shopInventory", pipeline);
    generate_pipeline_1.default.unWindStage("shopInventory", pipeline);
    generate_pipeline_1.default.unWindStage("shopInventory.product", pipeline);
    generate_pipeline_1.default.lookupStage("products", "shopInventory.product.productId", "_id", "shopInventory.product.product", pipeline);
    generate_pipeline_1.default.selectStage(pipeline, "inventory", "shopInventory.product.productId");
    pipeline.push({
        $addFields: {
            productsBelowThreshold: {
                $filter: {
                    input: "$shopInventory.product.product",
                    as: "productDetails",
                    cond: {
                        $lt: ["$shopInventory.product.quantity", "$$productDetails.threshold"]
                    }
                }
            }
        }
    });
    generate_pipeline_1.default.selectStage(pipeline, "shopInventory");
    if (pipeline.length === 0)
        pipeline.push({ $match: {} });
    return aggregation(pipeline);
});
const add = (shopCredentials) => __awaiter(void 0, void 0, void 0, function* () {
    const userCredentials = {
        name: shopCredentials.name,
        email: shopCredentials.email,
        password: shopCredentials.password
    };
    const user = yield auth_services_1.default.createOwner(userCredentials);
    const shop = {
        owner: user._id,
        location: shopCredentials.location,
        rating: 0
    };
    return shop_repo_1.default.add(shop);
});
const update = (filter, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield shop_repo_1.default.update(filter, data);
    if (result.modifiedCount <= 0)
        throw shop_responses_1.ShopResponses.UNABLE_TO_PROCEED;
    return shop_responses_1.ShopResponses.UPDATE_SUCCESS;
});
const remove = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield findOne(filter);
    if (!shop)
        throw shop_responses_1.ShopResponses.UNABLE_TO_PROCEED;
    yield inventory_services_1.default.remove(filter._id);
    yield user_services_1.default.remove({ _id: shop.owner });
    const result = yield shop_repo_1.default.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0)
        throw shop_responses_1.ShopResponses.UNABLE_TO_PROCEED;
    return shop_responses_1.ShopResponses.DELETE_SUCCESS;
});
exports.default = {
    find,
    findOne,
    add,
    update,
    remove,
    aggregation,
    customerRating,
    thresholdProducts
};
