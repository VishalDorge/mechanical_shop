import { Document, Schema } from "mongoose";

export interface IReward {
    _id?: Schema.Types.ObjectId;
    name: string;
    points: number;
}

export type RewardType = Document & IReward;