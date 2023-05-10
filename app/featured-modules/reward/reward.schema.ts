import { model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { RewardType } from "./reward.types";


const rewardSchema = new BaseSchema({

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

export const rewardModel = model<RewardType>("Reward", rewardSchema);