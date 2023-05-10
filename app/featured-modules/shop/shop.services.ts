import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IShop, IShopCredentials } from "./shop.types";
import shopRepo from "./shop.repo";
import { ShopResponses } from "./shop.responses";
import authServices from "../auth/auth.services";
import { convertValuesToOriginalType } from "../../utility/convert";
import generatePipeline from "../../utility/generate.pipeline";
import inventoryServices from "../inventory/inventory.services";
import userServices from "../user/user.services";

const findOne = (filter: FilterQuery<IShop>) => shopRepo.findOne(filter);

const find = (query: any) => {

    const pipeline: PipelineStage[] = [];

    const { page, limit, sortBy, sortOrder, ...filter } = query;

    convertValuesToOriginalType(filter);

    generatePipeline.matchStage(filter, pipeline);
    generatePipeline.lookupStage("users", "owner", "_id", "owner", pipeline);
    generatePipeline.sortingStage(sortBy, sortOrder, pipeline);
    generatePipeline.pagination(page || 1, limit || 3, pipeline);

    if (pipeline.length === 0) pipeline.push({ $match: {} });
    return shopRepo.aggregation(pipeline);
}

const aggregation = (pipeline: PipelineStage[]) => shopRepo.aggregation(pipeline);

const customerRating = async (shopId: string, newRating: number) => {

    const result = await shopRepo.update(
        { _id: shopId },
        { $push: { reviews: newRating } }
    );

    await shopRepo.update(
        { _id: shopId },
        [{ $set: { rating: { $round: [{ $avg: "$reviews" }, 1] } } }]
    )

    if (result.modifiedCount <= 0) throw ShopResponses.UNABLE_TO_PROCEED;
    return ShopResponses.RATING_SUCCESS;
}

const thresholdProducts = async (query: any) => {

    const pipeline: PipelineStage[] = [];

    const { shopId } = query;

    generatePipeline.matchStage(shopId ? { _id: shopId } : {}, pipeline);
    generatePipeline.lookupStage("inventories", "inventory", "_id", "shopInventory", pipeline);
    generatePipeline.unWindStage("shopInventory", pipeline);
    generatePipeline.unWindStage("shopInventory.product", pipeline);
    generatePipeline.lookupStage("products", "shopInventory.product.productId", "_id", "shopInventory.product.product", pipeline);
    generatePipeline.selectStage(pipeline, "inventory", "shopInventory.product.productId");

    pipeline.push({

        $addFields: {
            productsBelowThreshold: {
                $filter: {
                    input: "$shopInventory.product.product",
                    as: "productDetails",
                    cond: {
                        $lt: ["$shopInventory.product.quantity", "$$productDetails.threshold"]
                    }
                }
            }
        }
    })

    generatePipeline.selectStage(pipeline, "shopInventory");

    if (pipeline.length === 0) pipeline.push({ $match: {} });
    return aggregation(pipeline);
}

const add = async (shopCredentials: IShopCredentials) => {

    const userCredentials = {
        name: shopCredentials.name,
        email: shopCredentials.email,
        password: shopCredentials.password
    }

    const user = await authServices.createOwner(userCredentials);

    const shop = {
        owner: user._id,
        location: shopCredentials.location,
        rating: 0
    }

    return shopRepo.add(shop);
}

const update = async (filter: FilterQuery<IShop>, data: UpdateQuery<IShop>) => {
    const result = await shopRepo.update(filter, data);
    if (result.modifiedCount <= 0) throw ShopResponses.UNABLE_TO_PROCEED;
    return ShopResponses.UPDATE_SUCCESS;
}

const remove = async (filter: FilterQuery<IShop>) => {
    const shop = await findOne(filter);
    if(!shop) throw ShopResponses.UNABLE_TO_PROCEED;

    await inventoryServices.remove(filter._id);
    await userServices.remove({_id: shop.owner});

    const result = await shopRepo.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0) throw ShopResponses.UNABLE_TO_PROCEED;
    return ShopResponses.DELETE_SUCCESS;
}


export default {
    find,
    findOne,
    add,
    update,
    remove,
    aggregation,
    customerRating,
    thresholdProducts
}