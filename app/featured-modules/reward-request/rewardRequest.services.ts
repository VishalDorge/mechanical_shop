import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IRewardRequest } from "./rewardRequest.types";
import rewardRequestRepo from "./rewardRequest.repo";
import { RewardRequestResponses } from "./rewardRequest.responses";
import shopServices from "../shop/shop.services";
import rewardServices from "../reward/reward.services";
import userServices from "../user/user.services";
import { convertValuesToOriginalType } from "../../utility/convert";
import generatePipeline from "../../utility/generate.pipeline";

const findOne = (filter: FilterQuery<IRewardRequest>) => rewardRequestRepo.findOne(filter);

const add = async (ownerId: string, rewardId: string) => {

    const shop = await shopServices.findOne({ owner: ownerId });
    if (!shop) throw RewardRequestResponses.INVALID_OWNER;

    const reward = await rewardServices.findOne({ _id: rewardId });
    if (!reward) throw RewardRequestResponses.UNABLE_TO_PROCEED;
    
    const owner = await userServices.findOne({ _id: ownerId });

    if (reward.points > (owner?.points || 0)) {
        throw RewardRequestResponses.INSUFFICIENT_BALANCE;
    } else {
        
        const rewardRequest = {
            shopId: shop._id,
            rewardId,
            pointsAtTimeOfRequest: reward.points
        }

        await userServices.update(
            {_id: ownerId },
            { $inc: { points: reward.points * -1 } }
        );

        return rewardRequestRepo.add(rewardRequest);
    }
}

const cancleRequest = async (rewardRequestId: string) => {
    
    const rewardRequest = await findOne({_id: rewardRequestId, isApproved: false});
    if(!rewardRequest) throw RewardRequestResponses.NO_PENDING_REQUEST_FOUND;

    const shop = await shopServices.findOne({_id: rewardRequest.shopId});
    const reward = await rewardServices.findOne({_id: rewardRequest.rewardId});

    await userServices.update(
        {_id: shop?.owner},
        {$inc: {points: rewardRequest?.pointsAtTimeOfRequest}}
    );
    return await remove({_id: rewardRequestId});
}

const update = async (filter: FilterQuery<IRewardRequest>, data: UpdateQuery<IRewardRequest>) => {
    const result = await rewardRequestRepo.update(filter, data);
    if (result.modifiedCount <= 0) throw RewardRequestResponses.UNABLE_TO_PROCEED;
    return RewardRequestResponses.UPDATE_SUCCESS;
}

const remove = async (filter: FilterQuery<IRewardRequest>) => {
    const result = await rewardRequestRepo.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0) throw RewardRequestResponses.UNABLE_TO_PROCEED;
    return RewardRequestResponses.DELETE_SUCCESS;
}

const find = async (query: any) => {
    const pipeline: PipelineStage[] = [];

    const {page, limit, sortBy, sortOrder, ...filter} = query;

    convertValuesToOriginalType(filter);

    generatePipeline.matchStage(filter, pipeline);
    generatePipeline.lookupStage("shops", "shopId", "_id", "shop", pipeline);
    generatePipeline.lookupStage("rewards", "rewardId", "_id", "reward", pipeline);
    generatePipeline.selectStage(pipeline, "shopId", "rewardId");
    generatePipeline.sortingStage(sortBy, sortOrder, pipeline);
    generatePipeline.pagination(page || 1, limit || 3, pipeline);

    if (pipeline.length === 0) pipeline.push({ $match: {} });
    return rewardRequestRepo.aggregation(pipeline);
}

const approveRequest = (requestId: string) => {
    return update(
        {_id: requestId, isApproved: false, isDeleted: false},
        {isApproved: true}
    );
}

const rewardHistory = async (query: any) => {
    const pipeline: PipelineStage[] = [];
    const {page, limit, sortBy, sortOrder, ...filter} = query;
    convertValuesToOriginalType(filter);
    generatePipeline.matchStage({isApproved: true, ...filter}, pipeline);
    generatePipeline.lookupStage("rewards", "rewardId", "_id", "reward", pipeline);
    generatePipeline.selectStage(pipeline, "rewardId");
    generatePipeline.sortingStage(sortBy, sortOrder, pipeline);
    generatePipeline.pagination(page || 1, limit || 3, pipeline);
    return await rewardRequestRepo.aggregation(pipeline);
}

export default {
    find,
    findOne,
    add,
    update,
    remove,
    approveRequest,
    rewardHistory,
    cancleRequest
}