"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utility/base.schema");
const rewardSchema = new base_schema_1.BaseSchema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    points: {
        type: Number,
        required: true
    }
});
exports.rewardModel = (0, mongoose_1.model)("Reward", rewardSchema);
