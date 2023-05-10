"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRequestModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utility/base.schema");
const productRequestSchema = new base_schema_1.BaseSchema({
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shop"
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});
exports.productRequestModel = (0, mongoose_1.model)("ProductRequest", productRequestSchema);
