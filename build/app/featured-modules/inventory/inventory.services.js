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
const inventory_repo_1 = __importDefault(require("./inventory.repo"));
const inventory_responses_1 = require("./inventory.responses");
const generate_pipeline_1 = __importDefault(require("../../utility/generate.pipeline"));
const shop_services_1 = __importDefault(require("../shop/shop.services"));
const find = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [];
    const { page, limit, sortBy, sortOrder, shopId } = query;
    generate_pipeline_1.default.matchStage(shopId ? { _id: shopId } : {}, pipeline);
    generate_pipeline_1.default.lookupStage("inventories", "inventory", "_id", "shopInventory", pipeline);
    generate_pipeline_1.default.unWindStage("shopInventory", pipeline);
    generate_pipeline_1.default.unWindStage("shopInventory.product", pipeline);
    generate_pipeline_1.default.lookupStage("products", "shopInventory.product.productId", "_id", "shopInventory.product.productDetails", pipeline);
    generate_pipeline_1.default.lookupStage("users", "owner", "_id", "owner", pipeline);
    generate_pipeline_1.default.sortingStage(sortBy, sortOrder, pipeline);
    generate_pipeline_1.default.pagination(page || 1, limit || 3, pipeline);
    generate_pipeline_1.default.selectStage(pipeline, "owner.password");
    pipeline.push({
        $addFields: {
            belowThreshold: {
                $cond: {
                    if: { $lt: [] }
                }
            }
        }
    });
    if (pipeline.length === 0)
        pipeline.push({ $match: {} });
    return yield shop_services_1.default.aggregation(pipeline);
});
const findOne = (filter) => inventory_repo_1.default.findOne(filter);
const add = (inventory) => inventory_repo_1.default.add(inventory);
const update = (filter, data, options = []) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield inventory_repo_1.default.update(filter, data, options);
    if (result.modifiedCount <= 0)
        throw inventory_responses_1.InventoryResponses.UNABLE_TO_PROCEED;
    return inventory_responses_1.InventoryResponses.UPDATE_SUCCESS;
});
const remove = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_services_1.default.findOne({ _id: shopId });
    const result = yield inventory_repo_1.default.update({ _id: shop === null || shop === void 0 ? void 0 : shop.inventory }, { isDeleted: true });
    yield shop_services_1.default.update({ _id: shopId }, { inventory: null });
    if (result.modifiedCount <= 0)
        throw inventory_responses_1.InventoryResponses.UNABLE_TO_PROCEED;
    return inventory_responses_1.InventoryResponses.DELETE_SUCCESS;
});
const aggregation = (pipeline) => inventory_repo_1.default.aggregation(pipeline);
const updateInventory = (shopId, productUpdates) => __awaiter(void 0, void 0, void 0, function* () {
    const shop = yield shop_services_1.default.findOne({ _id: shopId });
    if (!shop)
        throw inventory_responses_1.InventoryResponses.UNABLE_TO_PROCEED;
    for (let singleProduct of productUpdates) {
        yield update({
            _id: shop.inventory,
            "product.productId": singleProduct.productId
        }, {
            $set: { "product.$[obj].quantity": singleProduct.quantity }
        }, {
            arrayFilters: [{
                    "obj.productId": singleProduct.productId
                }]
        });
    }
    return inventory_responses_1.InventoryResponses.UPDATE_SUCCESS;
});
exports.default = {
    find,
    findOne,
    add,
    update,
    remove,
    aggregation,
    updateInventory
};
