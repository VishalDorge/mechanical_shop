"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utility/base.schema");
const shopSchema = new base_schema_1.BaseSchema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
    location: {
        type: String,
        required: true
    },
    inventory: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Inventory",
        default: null
    },
    reviews: {
        type: [Number],
        default: []
    },
    rating: {
        type: Number,
        default: 0
    }
});
exports.shopModel = (0, mongoose_1.model)("Shop", shopSchema);
