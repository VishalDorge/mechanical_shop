import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IProduct } from "./product.types";
import productRepo from "./product.repo";
import { ProductResponses } from "./product.responses";
import { CustomPipeline } from "../../utility/generate.pipeline";

const findOne = (filter: FilterQuery<IProduct>) => productRepo.findOne(filter);

const find = (query: any) => {

    const pipeline = new CustomPipeline(query).generate();

    // const pipeline: PipelineStage[] = [];

    // const {page, limit, sortBy, sortOrder, ...filter} = query;
    // convertValuesToOriginalType(filter);

    // const pipeline = new CustomPipeline(filter)
    // .matchStage(filter)
    // .sortingStage(sortBy, sortOrder)
    // .pagination(page || 1, limit || 3)
    // .generate();

    // generatePipeline.matchStage(filter, pipeline);
    // generatePipeline.sortingStage(sortBy, sortOrder, pipeline);
    // generatePipeline.pagination(page || 1, limit || 3, pipeline);

    if (pipeline.length === 0) pipeline.push({ $match: {} });
    return productRepo.aggregation(pipeline);
}

const add = (product: IProduct) => {
    product.points ? product.isSpecial = true : product.isSpecial = false;
    return productRepo.add(product);
}

const update = async (filter: FilterQuery<IProduct>, data: UpdateQuery<IProduct>) => {
    const result = await productRepo.update(filter, data);
    if (result.modifiedCount <= 0) throw ProductResponses.UNABLE_TO_PROCEED;
    return ProductResponses.UPDATE_SUCCESS;
}

const remove = async (filter: FilterQuery<IProduct>) => {
    const result = await productRepo.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0) throw ProductResponses.UNABLE_TO_PROCEED;
    return ProductResponses.DELETE_SUCCESS;
}

export default {
    find,
    findOne,
    add,
    update,
    remove
}