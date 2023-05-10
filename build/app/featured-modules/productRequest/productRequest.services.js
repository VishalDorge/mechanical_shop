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
const productRequest_repo_1 = __importDefault(require("./productRequest.repo"));
const productRequest_responses_1 = require("./productRequest.responses");
const shop_services_1 = __importDefault(require("../shop/shop.services"));
const inventory_services_1 = __importDefault(require("../inventory/inventory.services"));
const convert_1 = require("../../utility/convert");
const generate_pipeline_1 = __importDefault(require("../../utility/generate.pipeline"));
const findOne = (filter) => {
    return productRequest_repo_1.default.findOne(filter);
};
const add = (ownerId, productList) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_services_1.default.findOne({ owner: ownerId });
    if (!shop)
        throw productRequest_responses_1.ProductRequestResponses.UNABLE_TO_PROCEED;
    for (let singleProduct of productList) {
        const productRequest = {
            shopId: shop._id,
            productId: singleProduct.productId,
            quantity: singleProduct.quantity
        };
        yield productRequest_repo_1.default.add(productRequest);
    }
    return productRequest_responses_1.ProductRequestResponses.ORDER_PLACED_SUCCESS;
});
const update = (filter, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield productRequest_repo_1.default.update(filter, data);
    if (result.modifiedCount <= 0)
        throw productRequest_responses_1.ProductRequestResponses.UNABLE_TO_PROCEED;
    return productRequest_responses_1.ProductRequestResponses.UPDATE_SUCCESS;
});
const remove = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield productRequest_repo_1.default.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0)
        throw productRequest_responses_1.ProductRequestResponses.UNABLE_TO_PROCEED;
    return productRequest_responses_1.ProductRequestResponses.DELETE_SUCCESS;
});
const find = (query) => {
    const pipeline = [];
    const { page, limit } = query, filter = __rest(query, ["page", "limit"]);
    (0, convert_1.convertValuesToOriginalType)(filter);
    generate_pipeline_1.default.matchStage(filter, pipeline);
    generate_pipeline_1.default.pagination(page, limit, pipeline);
    if (pipeline.length === 0)
        pipeline.push({ $match: {} });
    return productRequest_repo_1.default.aggregation(pipeline);
};
const customApprove = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield findOne({ _id: requestId, isApproved: false });
    if (!request)
        throw productRequest_responses_1.ProductRequestResponses.UNABLE_TO_PROCEED;
    const singleProduct = {
        productId: request.productId,
        quantity: request.quantity
    };
    const shop = yield shop_services_1.default.findOne({ _id: request.shopId });
    let result;
    if (!(shop === null || shop === void 0 ? void 0 : shop.inventory)) {
        const inventoryCredentials = {
            product: [singleProduct]
        };
        const inventory = yield inventory_services_1.default.add(inventoryCredentials);
        result = yield shop_services_1.default.update({ _id: request.shopId }, { $set: { inventory: inventory._id } });
    }
    else {
        const productExist = yield inventory_services_1.default.findOne({ _id: shop.inventory, "product.productId": request.productId });
        if (productExist) {
            result = yield inventory_services_1.default.update({
                _id: shop.inventory,
                "product.productId": request.productId
            }, {
                $inc: {
                    "product.$[xxx].quantity": request.quantity
                }
            }, {
                arrayFilters: [
                    { "xxx.productId": request.productId }
                ]
            });
        }
        else {
            result = yield inventory_services_1.default.update({ _id: shop.inventory }, { $push: { product: singleProduct } });
        }
    }
    yield update({ _id: requestId }, { isApproved: true });
    if (result.statusCode === 200)
        return productRequest_responses_1.ProductRequestResponses.INVENTORY_SUCCESS;
    else
        throw productRequest_responses_1.ProductRequestResponses.UNABLE_TO_PROCEED;
});
const approveRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield findOne({ _id: requestId, isApproved: false });
    if (!request)
        throw productRequest_responses_1.ProductRequestResponses.UNABLE_TO_PROCEED;
    const singleProduct = {
        productId: request.productId,
        quantity: request.quantity
    };
    const shop = yield shop_services_1.default.findOne({ _id: request.shopId });
    let result;
    if (!(shop === null || shop === void 0 ? void 0 : shop.inventory)) {
        const inventoryCredentials = {
            product: [singleProduct]
        };
        const inventory = yield inventory_services_1.default.add(inventoryCredentials);
        result = yield shop_services_1.default.update({ _id: request.shopId }, { $set: { inventory: inventory._id } });
    }
    else {
        const productExist = yield inventory_services_1.default.aggregation([
            {
                $match: {
                    _id: shop.inventory
                }
            },
            {
                $match: {
                    product: {
                        $elemMatch: {
                            productId: request.productId
                        }
                    }
                }
            }
        ]);
        if (productExist.length) {
            result = yield inventory_services_1.default.update({
                _id: shop.inventory,
                "product.productId": request.productId
            }, {
                $inc: {
                    "product.$[xxx].quantity": request.quantity
                }
            }, {
                arrayFilters: [
                    { "xxx.productId": request.productId }
                ]
            });
        }
        else {
            result = yield inventory_services_1.default.update({ _id: shop.inventory }, { $push: { product: singleProduct } });
        }
    }
    yield update({ _id: requestId }, { isApproved: true });
    if (result.statusCode === 200)
        return productRequest_responses_1.ProductRequestResponses.INVENTORY_SUCCESS;
    else
        throw productRequest_responses_1.ProductRequestResponses.UNABLE_TO_PROCEED;
});
exports.default = {
    find,
    findOne,
    add,
    update,
    remove,
    approveRequest,
    customApprove
};
