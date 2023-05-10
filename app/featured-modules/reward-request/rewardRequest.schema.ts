import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { RewardRequestType } from "./rewardRequest.types";

const rewardRequestSchema = new BaseSchema({

    shopId: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    },

    rewardId: {
        type: Schema.Types.ObjectId,
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

export const rewardRequestModel = model<RewardRequestType>("RewardRequest", rewardRequestSchema);