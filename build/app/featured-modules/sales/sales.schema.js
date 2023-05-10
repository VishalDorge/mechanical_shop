"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salesModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utility/base.schema");
const salesSchema = new base_schema_1.BaseSchema({
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shop"
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number
    },
    salesPrice: {
        type: Number
    },
    status: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Status"
    }
});
exports.salesModel = (0, mongoose_1.model)("Sales", salesSchema);
const status_schema_1 = require("../status/status.schema");
status_schema_1.statusModel.findOne();
