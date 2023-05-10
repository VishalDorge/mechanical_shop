import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { ISales } from "./sales.types";
import { salesModel } from "./sales.schema";


const find = (filter: FilterQuery<ISales>) => salesModel.find({isDeleted: false, ...filter});

const findOne = (filter: FilterQuery<ISales>) => salesModel.findOne({isDeleted: false, ...filter});

const add = (sales: ISales) => salesModel.create(sales);

const update = (filter: FilterQuery<ISales>, data: UpdateQuery<ISales>) => {
    return salesModel.updateMany(filter, data);
}

const aggregation = (pipeline: PipelineStage[]) => salesModel.aggregate(pipeline);

const remove = (filter: FilterQuery<ISales>) => salesModel.deleteMany(filter);

export default {
    find,
    findOne,
    add,
    update,
    aggregation,
    remove
}