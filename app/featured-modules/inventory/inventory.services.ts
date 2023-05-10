import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IInventory, IProductUpdate } from "./inventory.types";
import inventoryRepo from "./inventory.repo";
import { InventoryResponses } from "./inventory.responses";
import generatePipeline from "../../utility/generate.pipeline";
import shopServices from "../shop/shop.services";

const find = async (query: any) => {

    const pipeline: PipelineStage[] = [];

    const {page, limit, sortBy, sortOrder, shopId} = query;
    generatePipeline.matchStage(shopId ? {_id: shopId} : {}, pipeline);
    generatePipeline.lookupStage("inventories", "inventory", "_id", "shopInventory", pipeline);
    generatePipeline.unWindStage("shopInventory", pipeline);
    generatePipeline.unWindStage("shopInventory.product", pipeline);
    generatePipeline.lookupStage("products","shopInventory.product.productId","_id", "shopInventory.product.productDetails", pipeline);
    generatePipeline.lookupStage("users", "owner", "_id", "owner", pipeline);
    generatePipeline.sortingStage(sortBy, sortOrder, pipeline);
    generatePipeline.pagination(page || 1, limit || 3, pipeline);
    generatePipeline.selectStage(pipeline, "owner.password");
    
    pipeline.push({
        $addFields : {
            belowThreshold: {
                $cond: {
                    if : {$lt : []}
                }
            }
        }
    })

    if (pipeline.length === 0) pipeline.push({ $match: {} });
    return await shopServices.aggregation(pipeline);
}
const findOne = (filter: FilterQuery<IInventory>) => inventoryRepo.findOne(filter);

const add = (inventory: IInventory) => inventoryRepo.add(inventory);

const update = async (filter: FilterQuery<IInventory>, data: UpdateQuery<IInventory>, options: any = []) => {
    const result = await inventoryRepo.update(filter, data, options);
    if(result.modifiedCount <= 0) throw InventoryResponses.UNABLE_TO_PROCEED;
    return InventoryResponses.UPDATE_SUCCESS;
}

const remove = async (shopId: string) => {
    const shop = await shopServices.findOne({_id: shopId});
    const result = await inventoryRepo.update({_id: shop?.inventory}, {isDeleted: true});
    await shopServices.update({_id: shopId}, {inventory: null});
    if(result.modifiedCount <= 0) throw InventoryResponses.UNABLE_TO_PROCEED;
    return InventoryResponses.DELETE_SUCCESS;
}

const aggregation = (pipeline: PipelineStage[]) => inventoryRepo.aggregation(pipeline);

const updateInventory = async (shopId: string, productUpdates: IProductUpdate[]) => {
    const shop = await shopServices.findOne({_id: shopId});
    if(!shop) throw InventoryResponses.UNABLE_TO_PROCEED;
    for(let singleProduct of productUpdates){
        await update(
            {
                _id: shop.inventory,
                "product.productId": singleProduct.productId
            },
            {
                $set: { "product.$[obj].quantity": singleProduct.quantity}
            },
            {
                arrayFilters: [{
                    "obj.productId": singleProduct.productId
                }]
            }
        );
    }

    return InventoryResponses.UPDATE_SUCCESS;
}

export default {
    find,
    findOne,
    add,
    update,
    remove,
    aggregation,
    updateInventory
}