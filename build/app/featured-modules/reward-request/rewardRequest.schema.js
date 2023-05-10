"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardRequestModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utility/base.schema");
const rewardRequestSchema = new base_schema_1.BaseSchema({
    shopId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shop"
    },
    rewardId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Reward"
    },
    pointsAtTimeOfRequest: {
        type: Number
    },
    isApproved: {
        type: Boolean,
        default: false
    }
});
exports.rewardRequestModel = (0, mongoose_1.model)("RewardRequest", rewardRequestSchema);
