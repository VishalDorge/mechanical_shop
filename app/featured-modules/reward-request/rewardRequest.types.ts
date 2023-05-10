import { Document, Schema } from "mongoose";


export interface IRewardRequest {
    _id?: Schema.Types.ObjectId;
    shopId: string;
    rewardId: string;
    pointsAtTimeOfRequest: number;
}

export type RewardRequestType = Document & IRewardRequest;