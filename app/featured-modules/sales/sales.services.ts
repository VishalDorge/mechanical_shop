import { FilterQuery, PipelineStage, Types, UpdateQuery } from "mongoose";
import { ISales, ISingleSale } from "./sales.types";
import salesRepo from "./sales.repo";
import { SalesResponses } from "./sales.responses";
import shopServices from "../shop/shop.services";
import productServices from "../product/product.services";
import { convertValuesToOriginalType } from "../../utility/convert";
import generatePipeline from "../../utility/generate.pipeline";
import userServices from "../user/user.services";
import { statuses } from "../../utility/constant";
import inventoryServices from "../inventory/inventory.services";

const findOne = (filter: FilterQuery<ISales>) => salesRepo.findOne(filter);

const add = async (ownerId: string, salesList: ISingleSale[]) => {

    const shop = await shopServices.findOne({ owner: ownerId });

    for (let singleProduct of salesList) {

        if(singleProduct.quantity <= 0) continue;
        const product = await productServices.findOne({ _id: singleProduct.productId });

        const pipeline: PipelineStage[] = [];

        generatePipeline.matchStage({ _id: shop?.inventory }, pipeline);
        generatePipeline.unWindStage("product", pipeline);
        generatePipeline.matchStage({ "product.productId": singleProduct.productId }, pipeline);

        const productExist = await inventoryServices.aggregation(pipeline);

        if (productExist.length > 0 && productExist[0].product.quantity >= singleProduct.quantity) {

            const sales = {
                shopId: shop?._id,
                productId: singleProduct.productId,
                quantity: singleProduct.quantity,
                salesPrice: product?.price || -1,
                status: statuses.PENDING
            }

            await inventoryServices.update(
                {
                    _id: shop?.inventory,
                    "product.productId": singleProduct.productId
                },
                {
                    $inc: { "product.$[obj].quantity": singleProduct.quantity * -1 }
                },
                {
                    arrayFilters: [{
                        "obj.productId": singleProduct.productId
                    }]
                }
            )

            salesRepo.add(sales);
        } else throw SalesResponses.PRODUCT_OUT_OF_STOCK;
    }
    return SalesResponses.SALES_SUCCESS;
}

const update = async (filter: FilterQuery<ISales>, data: UpdateQuery<ISales>) => {
    const result = await salesRepo.update(filter, data);
    if (result.modifiedCount <= 0) throw SalesResponses.UNABLE_TO_PROCEED;
    return SalesResponses.UPDATE_SUCCESS;
}

const remove = async (filter: FilterQuery<ISales>) => {

    const sale = await findOne(filter);
    if (!sale) throw SalesResponses.UNABLE_TO_PROCEED;
    if (sale.status.toString() !== statuses.PENDING) return SalesResponses.REVENUE_VERIFIED;

    const shop = await shopServices.findOne({ _id: sale.shopId });

    await inventoryServices.update(
        {
            _id: shop?.inventory,
            "product.productId": sale.productId
        },
        {
            $inc: { "product.$[obj].quantity": sale.quantity }
        },
        {
            arrayFilters: [{
                "obj.productId": sale.productId
            }]
        }
    )

    const result = await salesRepo.update(filter, { isDeleted: true });
    if (result.modifiedCount <= 0) throw SalesResponses.UNABLE_TO_PROCEED;
    return SalesResponses.DELETE_SUCCESS;
}

const getRevenue = async (query: any) => {

    const { shopId, startDate, endDate } = query;

    const pipeline: PipelineStage[] = [];

    generatePipeline.matchStage(shopId ? { shopId } : {}, pipeline);

    startDate ? pipeline.push({
        $match: {
            createdAt: { $gte: new Date(startDate) }
        }
    }) : null;

    endDate ? pipeline.push({
        $match: {
            createdAt: { $lte: new Date(endDate) }
        }
    }) : null;

    pipeline.push({
        $group: {
            _id: new Types.ObjectId(shopId),
            revenue: { $sum: { $multiply: ["$salesPrice", "$quantity"] } }
        }
    });

    const result = await salesRepo.aggregation(pipeline);
    if (result.length === 0) return { revenue: 0 };
    else return result;
}

const updateSales = async (ownerId: string, salesId: string, quantity: number) => {
    const oldSale = await findOne({ _id: salesId, status: statuses.PENDING });
    if (!oldSale) throw SalesResponses.REVENUE_VERIFIED;

    const shop = await shopServices.findOne({ _id: oldSale.shopId });

    if(shop?.owner.toString() != ownerId) throw SalesResponses.UNABLE_TO_PROCEED; 

    if (quantity > 0) {

        const pipeline: PipelineStage[] = [];

        generatePipeline.matchStage({ _id: shop?.inventory }, pipeline);
        generatePipeline.unWindStage("product", pipeline);
        generatePipeline.matchStage({ "product.productId": oldSale.productId }, pipeline);
        const productExist = await inventoryServices.aggregation(pipeline);

        if (productExist[0] && productExist[0].product.quantity >= (quantity - oldSale.quantity)) {
            await inventoryServices.update(
                {
                    _id: shop?.inventory,
                    "product.productId": oldSale.productId
                },
                {
                    $inc: { "product.$[obj].quantity": (quantity - oldSale.quantity) * -1 }
                },
                {
                    arrayFilters: [{
                        "obj.productId": oldSale.productId
                    }]
                }
            )

            return update({_id: salesId}, {$set: {quantity: quantity}});
        } else throw SalesResponses.PRODUCT_OUT_OF_STOCK;
    } else if(quantity === 0) return remove({ _id: salesId });
    else throw SalesResponses.UNABLE_TO_PROCEED;

}

const productLeaders = async (query: any) => {

    const { page, limit, productId } = query;

    const pipeline: PipelineStage[] = [];

    generatePipeline.matchStage({}, pipeline);

    pipeline.push({
        $group: {
            _id: { productId: "$productId", shopId: "$shopId" },
            count: { $sum: "$quantity" }
        }
    });

    generatePipeline.lookupStage("products", "_id.productId", "_id", "product", pipeline);
    generatePipeline.lookupStage("shops", "_id.shopId", "_id", "shop", pipeline);
    generatePipeline.lookupStage("users", "shop.owner", "_id", "shopOwner", pipeline);
    generatePipeline.selectStage(pipeline, "_id");

    if (productId) {
        pipeline.push({
            $match: {
                "product._id": new Types.ObjectId(productId)
            }
        })
    }

    generatePipeline.sortingStage("count", "desc", pipeline);
    generatePipeline.pagination(page || 1, limit || 1, pipeline);
    const result = await salesRepo.aggregation(pipeline);
    return result;
}

const revenueLeaders = () => {

    const pipeline: PipelineStage[] = [];

    generatePipeline.matchStage({}, pipeline);

    pipeline.push({
        $group: {
            _id: "$shopId",
            revenue: {
                $sum: { $multiply: ["$salesPrice", "$quantity"] }
            }
        }
    });

    generatePipeline.sortingStage("revenue", "desc", pipeline);
    generatePipeline.lookupStage("shops", "_id", "_id", "shop", pipeline);
    generatePipeline.selectStage(pipeline, "_id");

    pipeline.push({
        $limit: 10
    });

    return salesRepo.aggregation(pipeline);
}

const find = (query: any) => {

    const pipeline: PipelineStage[] = [];

    const { page, limit, ...filter } = query;

    convertValuesToOriginalType(filter);

    generatePipeline.matchStage(filter, pipeline);
    generatePipeline.lookupStage("products", "productId", "_id", "product", pipeline);
    generatePipeline.lookupStage("status", "status", "_id", "status", pipeline);
    // generatePipeline.lookupStage("shops", "shopId", "_id", "shop", pipeline);
    generatePipeline.selectStage(pipeline, "productId");

    generatePipeline.pagination(page || 1, limit || 3, pipeline);

    if (pipeline.length === 0) pipeline.push({ $match: {} });
    return salesRepo.aggregation(pipeline);
}

const verifySales = async (shopId: string, isApproved: boolean, query: any) => {

    if (!isApproved) {
        update({ shopId }, { status: statuses.REJECTED });
        return SalesResponses.REVENUE_NOT_MATCHED;
    }

    const pipeline: PipelineStage[] = [];

    generatePipeline.matchStage({ shopId, status: statuses.PENDING }, pipeline);
    generatePipeline.lookupStage("products", "productId", "_id", "product", pipeline);
    generatePipeline.selectStage(pipeline, "productId");

    pipeline.push({
        $unwind: "$product"
    });

    pipeline.push({
        $group: {
            _id: "$shopId",
            revenue: {
                $sum: {
                    $multiply: ["$salesPrice", "$quantity"]
                }
            },
            points: {
                $sum: "$product.points"
            }
        }
    })

    if (pipeline.length === 0) pipeline.push({ $match: {} });
    const result = await salesRepo.aggregation(pipeline);
    if (result.length === 0) throw SalesResponses.REVENUE_VERIFIED;

    const shop = await shopServices.findOne({ _id: shopId });

    await userServices.update(
        { _id: shop?.owner },
        { $inc: { points: result[0].points } }
    );

    update({ shopId }, { status: statuses.VERIFIED });
    return SalesResponses.REVENUE_MATCHED;

}

const cancleSale = async (ownerId: string, salesId: string) => {
    const oldSale = await findOne({_id: salesId});
    const shop = await shopServices.findOne({_id: oldSale?.shopId});
    if(ownerId !== shop?.owner.toString()) throw SalesResponses.UNABLE_TO_PROCEED;
    return remove({_id: salesId});
}

export default {
    find,
    findOne,
    add,
    update,
    remove,
    verifySales,
    getRevenue,
    revenueLeaders,
    productLeaders,
    updateSales,
    cancleSale
}