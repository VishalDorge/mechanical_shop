import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IInventory } from "./inventory.types";
import { inventoryModel } from "./inventory.schema";

const find = (filter: FilterQuery<IInventory>) => inventoryModel.find(
    { isDeleted: false, ...filter }
);

const findOne = (filter: FilterQuery<IInventory>) => inventoryModel.findOne(
    { isDeleted: false, ...filter }
);

const add = (inventory: IInventory) => inventoryModel.create(inventory);

const update = (
    filter: FilterQuery<IInventory>,
    data: UpdateQuery<IInventory>, options: any = []
) => inventoryModel.updateMany(filter, data, options);

const aggregation = (pipeline: PipelineStage[]) => inventoryModel.aggregate(pipeline);

export default {
    find,
    findOne,
    add,
    update,
    aggregation
}