import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IProduct } from "./product.types";
import { productModel } from "./product.schema";

const find = (filter: FilterQuery<IProduct>) => productModel.find({isDeleted: false, ...filter});

const findOne = (filter: FilterQuery<IProduct>) => productModel.findOne({isDeleted: false, ...filter});

const aggregation = (pipeline: PipelineStage[]) => {
    return productModel.aggregate(pipeline);
}

const add = (product: IProduct) => productModel.create(product);

const update = (filter: FilterQuery<IProduct>, data: UpdateQuery<IProduct>) => {
    return productModel.updateMany(filter, data);
}

export default {
    find,
    findOne,
    add,
    update,
    aggregation
}