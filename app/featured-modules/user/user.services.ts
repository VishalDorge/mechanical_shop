import { FilterQuery, PipelineStage, Types, UpdateQuery } from "mongoose";
import { IUser } from "./user.types";
import userRepo from "./user.repo";
import { UserResponses } from "./user.responses";
import generatePipeline from "../../utility/generate.pipeline";
import { convertValuesToOriginalType } from "../../utility/convert";

const find = (query: any) => {
    const pipeline: PipelineStage[] = [];
    const {page, limit, sortBy, sortOrder, ...filter} = query;
    
    convertValuesToOriginalType(filter);

    generatePipeline.matchStage(filter, pipeline);
    generatePipeline.sortingStage(sortBy, sortOrder, pipeline);
    generatePipeline.pagination(page || 1, limit || 3, pipeline);

    return userRepo.aggregation(pipeline);
}
const findOne = (filter: FilterQuery<IUser>) => userRepo.findOne(filter);

const add = async (user: IUser) => {
    try {
        const oldUser = await userRepo.findOne({ email: user.email });
        if (oldUser) throw UserResponses.USER_ALREADY_EXIST;
        return userRepo.add(user);
    } catch (err) {
        throw err;
    }
}

const update = async (filter: FilterQuery<IUser>, data: UpdateQuery<IUser>) => {
    const result = await userRepo.update(filter, data);
    if(result.modifiedCount >= 0) return UserResponses.UPADATE_SUCCESS;
    else throw UserResponses.COULD_NOT_PROCEED;
}

const pointLeaders = (query: any) => {
    
    convertValuesToOriginalType(query);
    const {page, limit, sortBy, sortOrder, ...filter} = query;
    const pipeline: PipelineStage[] = [];

    generatePipeline.matchStage(filter, pipeline);

    pipeline.push({
        $group: {
            _id: "$email",
            points: {$sum: "$points"}
        }
    });

    generatePipeline.sortingStage(sortBy, sortOrder, pipeline);
    generatePipeline.pagination(page || 1, limit || 10, pipeline);
    return userRepo.aggregation(pipeline);
}

const remove = async (filter: FilterQuery<IUser>) => {
    const result = await userRepo.update(filter, {isDeleted: true});
    if(result.modifiedCount >0) return UserResponses.DELETE_SUCCESS;
    else throw UserResponses.COULD_NOT_PROCEED;   
}

export default {
    find,
    findOne,
    update,
    remove,
    add,
    pointLeaders
}