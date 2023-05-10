import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IUser } from "./user.types";
import { userModel } from "./user.schema";

const find = (filter: FilterQuery<IUser>) => userModel.find({ isDeleted: false, ...filter });
const findOne = (filter: FilterQuery<IUser>) => userModel.findOne({ isDeleted: false, ...filter });
const add = (user: IUser) => userModel.create(user);
const update = (filter: FilterQuery<IUser>, data: UpdateQuery<IUser>) => userModel.updateMany({ isDeleted: false, ...filter }, data);

const aggregation = (pipeline: PipelineStage[]) => userModel.aggregate(pipeline);

export default {
    find,
    findOne,
    add,
    update,
    aggregation
}
