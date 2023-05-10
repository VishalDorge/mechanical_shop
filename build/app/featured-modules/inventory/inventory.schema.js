"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inventoryModel = exports.inventorySchema = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utility/base.schema");
exports.inventorySchema = new base_schema_1.BaseSchema({
    product: {
        type: [
            {
                productId: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "Product"
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
});
exports.inventoryModel = (0, mongoose_1.model)("Inventory", exports.inventorySchema);
