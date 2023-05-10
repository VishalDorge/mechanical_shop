import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IProductRequest } from "./productRequest.types";
import { productRequestModel } from "./productRequest.schema";


const find = (filter: FilterQuery<IProductRequest>) => productRequestModel.find({isDeleted: false, ...filter});

const findOne = (filter: FilterQuery<IProductRequest>) => productRequestModel.findOne({isDeleted: false, ...filter});

const add = (productRequest: IProductRequest) => productRequestModel.create(productRequest);

const update = (filter: FilterQuery<IProductRequest>, data: UpdateQuery<IProductRequest>) =>{
    return productRequestModel.updateMany(filter, data);
}

const aggregation = (pipeline: PipelineStage[]) => productRequestModel.aggregate(pipeline);

export default {
    find,
    findOne,
    add,
    update,
    aggregation
}