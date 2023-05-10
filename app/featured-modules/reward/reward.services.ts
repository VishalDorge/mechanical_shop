import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IReward } from "./reward.types";
import rewardRepo from "./reward.repo";
import { RewardResponses } from "./reward.responses";
import { convertValuesToOriginalType } from "../../utility/convert";
import generatePipeline from "../../utility/generate.pipeline";
import shopServices from "../shop/shop.services";

const findOne = (filter: FilterQuery<IReward>) => rewardRepo.findOne(filter);

const add = async (reward: IReward) => {
    const rewardExist = await findOne({ name: reward.name })
    if (rewardExist) throw RewardResponses.REWARD_ALREADY_EXIST;
    return rewardRepo.add(reward);
}

const update = async (filter: FilterQuery<IReward>, data: UpdateQuery<IReward>) => {
    const result = await rewardRepo.update(filter, data);
    if (result.modifiedCount <= 0) throw RewardResponses.UNABLE_TO_PROCEED;
    return RewardResponses.UPDATE_SUCCESS;
}

const remove = async (filter: FilterQuery<IReward>) => {
    const result = await rewardRepo.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0) throw RewardResponses.UNABLE_TO_PROCEED;
    return RewardResponses.DELETE_SUCCESS;
}

const find = (query: any) => {
    const pipeline: PipelineStage[] = [];

    const { page, limit, sortBy, sortOrder, ...filter } = query;

    convertValuesToOriginalType(filter);

    generatePipeline.matchStage(filter, pipeline);
    generatePipeline.sortingStage(sortBy, sortOrder, pipeline);
    generatePipeline.pagination(page || 1, limit || 3, pipeline);

    if (pipeline.length === 0) pipeline.push({ $match: {} });
    return rewardRepo.aggregation(pipeline);
}

const currentReward = async (ownerId: string) => {

    const shop = await shopServices.findOne({owner: ownerId});
    if(!shop) throw RewardResponses.UNABLE_TO_PROCEED;

    const pipeline: PipelineStage[] = [];
    generatePipeline.matchStage({ _id: shop._id }, pipeline);
    generatePipeline.lookupStage("users", "owner", "_id", "owner", pipeline);
    const result = await shopServices.aggregation(pipeline);

    const currentReward = await rewardRepo.find(
        { points: { $lte: result[0].owner[0].points } }
    ).sort({"_id": 1});

    const rewardDetails = currentReward.map(reward => {
        return {id: reward._id, name: reward.name, points: reward.points}
    });

    const nextBestReward = await findOne({ points: { $gt: result[0].owner[0].points } });

    const finalResponse = {
        currentReward: currentReward.length ? rewardDetails : "NA",
        nextBestReward: nextBestReward ? {id: nextBestReward._id, name: nextBestReward.name} : "NA",
        pointsRequired: nextBestReward ? (nextBestReward.points - result[0].owner[0].points) : -1
    }
    return finalResponse;
}

export default {
    find,
    findOne,
    add,
    update,
    remove,
    currentReward
}