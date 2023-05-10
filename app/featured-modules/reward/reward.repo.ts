import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IReward } from "./reward.types";
import { rewardModel } from "./reward.schema";


const find = (filter: FilterQuery<IReward>) => rewardModel.find({isDeleted: false, ...filter});

const findOne = (filter: FilterQuery<IReward>) => rewardModel.findOne({isDeleted: false, ...filter});

const add = (reward: IReward) => rewardModel.create(reward);

const update = (filter: FilterQuery<IReward>, data: UpdateQuery<IReward>) => {
    return rewardModel.updateMany(filter, data);
}

const aggregation = (pipeline: PipelineStage[]) => {
    return rewardModel.aggregate(pipeline);
}

export default {
    find,
    findOne,
    add,
    update,
    aggregation
}