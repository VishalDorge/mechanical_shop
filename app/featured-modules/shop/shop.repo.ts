import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IShop } from "./shop.types";
import { shopModel } from "./shop.schema";


const find = (filter: FilterQuery<IShop>) => shopModel.find({isDeleted: false, ...filter});

const findOne = (filter: FilterQuery<IShop>) => shopModel.findOne({isDeleted: false, ...filter});

const add = (Shop: IShop) => shopModel.create(Shop);

const update = (filter: FilterQuery<IShop>, data: UpdateQuery<IShop> | Array<any>) => {
    return shopModel.updateMany(filter, data);
}

const aggregation = (pipeline: PipelineStage[]) => {
    return shopModel.aggregate(pipeline);
}

export default {
    find,
    findOne,
    add,
    update,
    aggregation
}