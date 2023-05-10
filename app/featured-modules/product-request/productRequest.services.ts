import { FilterQuery, PipelineStage, UpdateQuery } from "mongoose";
import { IProductRequest, ISingleOrder } from "./productRequest.types";
import productRequestRepo from "./productRequest.repo";
import { ProductRequestResponses } from "./productRequest.responses";
import shopServices from "../shop/shop.services";
import inventoryServices from "../inventory/inventory.services";
import { convertValuesToOriginalType } from "../../utility/convert";
import generatePipeline from "../../utility/generate.pipeline";

const findOne = (filter: FilterQuery<IProductRequest>) => {
    return productRequestRepo.findOne(filter);
}

const add = async (ownerId: string, productList: ISingleOrder[]) => {

    const shop = await shopServices.findOne({ owner: ownerId })
    if (!shop) throw ProductRequestResponses.UNABLE_TO_PROCEED;

    for (let singleProduct of productList) {

        const productRequest = {
            shopId: shop._id,
            productId: singleProduct.productId,
            quantity: singleProduct.quantity
        }

        productRequestRepo.add(productRequest);
    }
    return ProductRequestResponses.ORDER_PLACED_SUCCESS;
}

const update = async (filter: FilterQuery<IProductRequest>, data: UpdateQuery<IProductRequest>) => {
    const result = await productRequestRepo.update(filter, data);
    if (result.modifiedCount <= 0) throw ProductRequestResponses.UNABLE_TO_PROCEED;
    return ProductRequestResponses.UPDATE_SUCCESS;
}

const remove = async (filter: FilterQuery<IProductRequest>) => {
    const result = await productRequestRepo.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0) throw ProductRequestResponses.UNABLE_TO_PROCEED;
    return ProductRequestResponses.DELETE_SUCCESS;
}

const find = (query: any) => {

    const pipeline: PipelineStage[] = [];

    const { page, limit, ...filter } = query;

    convertValuesToOriginalType(filter);

    generatePipeline.matchStage(filter, pipeline);
    generatePipeline.lookupStage("shops", "shopId", "_id", "shop", pipeline);
    generatePipeline.lookupStage("products", "productId", "_id", "product", pipeline);
    generatePipeline.selectStage(pipeline, "productId");
    generatePipeline.pagination(page || 1, limit || 3, pipeline);

    if (pipeline.length === 0) pipeline.push({ $match: {} });
    return productRequestRepo.aggregation(pipeline);
}

const addProductToInventory = async (requestId: string) => {

    const request = await findOne({ _id: requestId });
    if (!request) throw "invalid request id";

    const shop = await shopServices.findOne({ _id: request.shopId });
    if (!shop) throw "invalid id for shop";

    const singleProduct = {
        productId: request?.productId || "",
        quantity: request?.quantity || -1
    }

    let result;

    if (!shop?.inventory) {
        const inventoryCredentials = { product: [singleProduct] }
        const inventory = await inventoryServices.add(inventoryCredentials);

        result = await shopServices.update(
            { _id: request?.shopId },
            { $set: { inventory: inventory._id } }
        );

    } else {

        const productExist = await inventoryServices.findOne({
            _id: shop.inventory,
            "product.productId": request.productId
        });

        if (productExist) {

            result = await inventoryServices.update(
                {
                    _id: shop.inventory,
                    "product.productId": request.productId
                },
                {
                    $inc: { "product.$[obj].quantity": request.quantity }
                },
                {
                    arrayFilters: [{
                        "obj.productId": request.productId
                    }]
                }
            );

        } else {

            result = await inventoryServices.update(
                { _id: shop.inventory },
                { $push: { product: singleProduct } }
            );
        }
    }

    return await update({ _id: requestId }, { isApproved: true });
}

const approveRequest = async (id: string) => {
    const shop = await shopServices.findOne({ _id: id });
    if (shop) {
        const allRequests = await find({ shopId: id, isApproved: false });
        allRequests.forEach(request => addProductToInventory(request._id))
    } else addProductToInventory(id);

    return ProductRequestResponses.INVENTORY_SUCCESS;
}


export default {
    find,
    findOne,
    add,
    update,
    remove,
    approveRequest
}