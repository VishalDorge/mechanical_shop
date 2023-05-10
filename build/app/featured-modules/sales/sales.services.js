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
const mongoose_1 = require("mongoose");
const sales_repo_1 = __importDefault(require("./sales.repo"));
const sales_responses_1 = require("./sales.responses");
const shop_services_1 = __importDefault(require("../shop/shop.services"));
const product_services_1 = __importDefault(require("../product/product.services"));
const convert_1 = require("../../utility/convert");
const generate_pipeline_1 = __importDefault(require("../../utility/generate.pipeline"));
const user_services_1 = __importDefault(require("../user/user.services"));
const constant_1 = require("../../utility/constant");
const inventory_services_1 = __importDefault(require("../inventory/inventory.services"));
const findOne = (filter) => sales_repo_1.default.findOne(filter);
const add = (ownerId, salesList) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_services_1.default.findOne({ owner: ownerId });
    for (let singleProduct of salesList) {
        if (singleProduct.quantity <= 0)
            continue;
        const product = yield product_services_1.default.findOne({ _id: singleProduct.productId });
        const pipeline = [];
        generate_pipeline_1.default.matchStage({ _id: shop === null || shop === void 0 ? void 0 : shop.inventory }, pipeline);
        generate_pipeline_1.default.unWindStage("product", pipeline);
        generate_pipeline_1.default.matchStage({ "product.productId": singleProduct.productId }, pipeline);
        const productExist = yield inventory_services_1.default.aggregation(pipeline);
        if (productExist.length > 0 && productExist[0].product.quantity >= singleProduct.quantity) {
            const sales = {
                shopId: shop === null || shop === void 0 ? void 0 : shop._id,
                productId: singleProduct.productId,
                quantity: singleProduct.quantity,
                salesPrice: (product === null || product === void 0 ? void 0 : product.price) || -1,
                status: constant_1.statuses.PENDING
            };
            yield inventory_services_1.default.update({
                _id: shop === null || shop === void 0 ? void 0 : shop.inventory,
                "product.productId": singleProduct.productId
            }, {
                $inc: { "product.$[obj].quantity": singleProduct.quantity * -1 }
            }, {
                arrayFilters: [{
                        "obj.productId": singleProduct.productId
                    }]
            });
            sales_repo_1.default.add(sales);
        }
        else
            throw sales_responses_1.SalesResponses.PRODUCT_OUT_OF_STOCK;
    }
    return sales_responses_1.SalesResponses.SALES_SUCCESS;
});
const update = (filter, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield sales_repo_1.default.update(filter, data);
    if (result.modifiedCount <= 0)
        throw sales_responses_1.SalesResponses.UNABLE_TO_PROCEED;
    return sales_responses_1.SalesResponses.UPDATE_SUCCESS;
});
const remove = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    const sale = yield findOne(filter);
    if (!sale)
        throw sales_responses_1.SalesResponses.UNABLE_TO_PROCEED;
    if (sale.status.toString() !== constant_1.statuses.PENDING)
        return sales_responses_1.SalesResponses.REVENUE_VERIFIED;
    const shop = yield shop_services_1.default.findOne({ _id: sale.shopId });
    yield inventory_services_1.default.update({
        _id: shop === null || shop === void 0 ? void 0 : shop.inventory,
        "product.productId": sale.productId
    }, {
        $inc: { "product.$[obj].quantity": sale.quantity }
    }, {
        arrayFilters: [{
                "obj.productId": sale.productId
            }]
    });
    const result = yield sales_repo_1.default.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0)
        throw sales_responses_1.SalesResponses.UNABLE_TO_PROCEED;
    return sales_responses_1.SalesResponses.DELETE_SUCCESS;
});
const getRevenue = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { shopId, startDate, endDate } = query;
    const pipeline = [];
    generate_pipeline_1.default.matchStage(shopId ? { shopId } : {}, pipeline);
    startDate ? pipeline.push({
        $match: {
            createdAt: { $gte: new Date(startDate) }
        }
    }) : null;
    endDate ? pipeline.push({
        $match: {
            createdAt: { $lte: new Date(endDate) }
        }
    }) : null;
    pipeline.push({
        $group: {
            _id: new mongoose_1.Types.ObjectId(shopId),
            revenue: { $sum: { $multiply: ["$salesPrice", "$quantity"] } }
        }
    });
    const result = yield sales_repo_1.default.aggregation(pipeline);
    if (result.length === 0)
        return { revenue: 0 };
    else
        return result;
});
const updateSales = (ownerId, salesId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const oldSale = yield findOne({ _id: salesId, status: constant_1.statuses.PENDING });
    if (!oldSale)
        throw sales_responses_1.SalesResponses.REVENUE_VERIFIED;
    const shop = yield shop_services_1.default.findOne({ _id: oldSale.shopId });
    if ((shop === null || shop === void 0 ? void 0 : shop.owner.toString()) != ownerId)
        throw sales_responses_1.SalesResponses.UNABLE_TO_PROCEED;
    if (quantity > 0) {
        const pipeline = [];
        generate_pipeline_1.default.matchStage({ _id: shop === null || shop === void 0 ? void 0 : shop.inventory }, pipeline);
        generate_pipeline_1.default.unWindStage("product", pipeline);
        generate_pipeline_1.default.matchStage({ "product.productId": oldSale.productId }, pipeline);
        const productExist = yield inventory_services_1.default.aggregation(pipeline);
        if (productExist[0] && productExist[0].product.quantity >= (quantity - oldSale.quantity)) {
            yield inventory_services_1.default.update({
                _id: shop === null || shop === void 0 ? void 0 : shop.inventory,
                "product.productId": oldSale.productId
            }, {
                $inc: { "product.$[obj].quantity": (quantity - oldSale.quantity) * -1 }
            }, {
                arrayFilters: [{
                        "obj.productId": oldSale.productId
                    }]
            });
            return update({ _id: salesId }, { $set: { quantity: quantity } });
        }
        else
            throw sales_responses_1.SalesResponses.PRODUCT_OUT_OF_STOCK;
    }
    else if (quantity === 0)
        return remove({ _id: salesId });
    else
        throw sales_responses_1.SalesResponses.UNABLE_TO_PROCEED;
});
const productLeaders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, productId } = query;
    const pipeline = [];
    generate_pipeline_1.default.matchStage({}, pipeline);
    pipeline.push({
        $group: {
            _id: { productId: "$productId", shopId: "$shopId" },
            count: { $sum: "$quantity" }
        }
    });
    generate_pipeline_1.default.lookupStage("products", "_id.productId", "_id", "product", pipeline);
    generate_pipeline_1.default.lookupStage("shops", "_id.shopId", "_id", "shop", pipeline);
    generate_pipeline_1.default.lookupStage("users", "shop.owner", "_id", "shopOwner", pipeline);
    generate_pipeline_1.default.selectStage(pipeline, "_id");
    if (productId) {
        pipeline.push({
            $match: {
                "product._id": new mongoose_1.Types.ObjectId(productId)
            }
        });
    }
    generate_pipeline_1.default.sortingStage("count", "desc", pipeline);
    generate_pipeline_1.default.pagination(page || 1, limit || 1, pipeline);
    const result = yield sales_repo_1.default.aggregation(pipeline);
    return result;
});
const revenueLeaders = () => {
    const pipeline = [];
    generate_pipeline_1.default.matchStage({}, pipeline);
    pipeline.push({
        $group: {
            _id: "$shopId",
            revenue: {
                $sum: { $multiply: ["$salesPrice", "$quantity"] }
            }
        }
    });
    generate_pipeline_1.default.sortingStage("revenue", "desc", pipeline);
    generate_pipeline_1.default.lookupStage("shops", "_id", "_id", "shop", pipeline);
    generate_pipeline_1.default.selectStage(pipeline, "_id");
    pipeline.push({
        $limit: 10
    });
    return sales_repo_1.default.aggregation(pipeline);
};
const find = (query) => {
    const pipeline = [];
    const { page, limit } = query, filter = __rest(query, ["page", "limit"]);
    (0, convert_1.convertValuesToOriginalType)(filter);
    generate_pipeline_1.default.matchStage(filter, pipeline);
    generate_pipeline_1.default.lookupStage("products", "productId", "_id", "product", pipeline);
    generate_pipeline_1.default.lookupStage("status", "status", "_id", "status", pipeline);
    // generatePipeline.lookupStage("shops", "shopId", "_id", "shop", pipeline);
    generate_pipeline_1.default.selectStage(pipeline, "productId");
    generate_pipeline_1.default.pagination(page || 1, limit || 3, pipeline);
    if (pipeline.length === 0)
        pipeline.push({ $match: {} });
    return sales_repo_1.default.aggregation(pipeline);
};
const verifySales = (shopId, isApproved, query) => __awaiter(void 0, void 0, void 0, function* () {
    if (!isApproved) {
        update({ shopId }, { status: constant_1.statuses.REJECTED });
        return sales_responses_1.SalesResponses.REVENUE_NOT_MATCHED;
    }
    const pipeline = [];
    generate_pipeline_1.default.matchStage({ shopId, status: constant_1.statuses.PENDING }, pipeline);
    generate_pipeline_1.default.lookupStage("products", "productId", "_id", "product", pipeline);
    generate_pipeline_1.default.selectStage(pipeline, "productId");
    pipeline.push({
        $unwind: "$product"
    });
    pipeline.push({
        $group: {
            _id: "$shopId",
            revenue: {
                $sum: {
                    $multiply: ["$salesPrice", "$quantity"]
                }
            },
            points: {
                $sum: "$product.points"
            }
        }
    });
    if (pipeline.length === 0)
        pipeline.push({ $match: {} });
    const result = yield sales_repo_1.default.aggregation(pipeline);
    if (result.length === 0)
        throw sales_responses_1.SalesResponses.REVENUE_VERIFIED;
    const shop = yield shop_services_1.default.findOne({ _id: shopId });
    yield user_services_1.default.update({ _id: shop === null || shop === void 0 ? void 0 : shop.owner }, { $inc: { points: result[0].points } });
    update({ shopId }, { status: constant_1.statuses.VERIFIED });
    return sales_responses_1.SalesResponses.REVENUE_MATCHED;
});
const cancleSale = (ownerId, salesId) => __awaiter(void 0, void 0, void 0, function* () {
    const oldSale = yield findOne({ _id: salesId });
    const shop = yield shop_services_1.default.findOne({ _id: oldSale === null || oldSale === void 0 ? void 0 : oldSale.shopId });
    if (ownerId !== (shop === null || shop === void 0 ? void 0 : shop.owner.toString()))
        throw sales_responses_1.SalesResponses.UNABLE_TO_PROCEED;
    return remove({ _id: salesId });
});
exports.default = {
    find,
    findOne,
    add,
    update,
    remove,
    verifySales,
    getRevenue,
    revenueLeaders,
    productLeaders,
    updateSales,
    cancleSale
};
