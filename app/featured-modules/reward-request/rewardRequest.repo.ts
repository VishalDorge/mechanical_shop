import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IRewardRequest } from "./rewardRequest.types";
import { rewardRequestModel } from "./rewardRequest.schema";

const find = (filter: FilterQuery<IRewardRequest>) => rewardRequestModel.find({isDeleted: false, ...filter});

const findOne = (filter: FilterQuery<IRewardRequest>) => rewardRequestModel.findOne({isDeleted: false, ...filter});

const add = (rewardRequest: IRewardRequest) => rewardRequestModel.create(rewardRequest);

const update = (filter: FilterQuery<IRewardRequest>, data: UpdateQuery<IRewardRequest>) => {
    return rewardRequestModel.updateMany(filter, data);
}

const aggregation = (pipeline: PipelineStage[]) => rewardRequestModel.aggregate(pipeline);

export default {
    find,
    findOne,
    add,
    update,
    aggregation
}