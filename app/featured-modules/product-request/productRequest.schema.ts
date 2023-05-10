import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { ProductRequestType } from "./productRequest.types";

const productRequestSchema = new BaseSchema({

    shopId: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },

    quantity: {
        type: Number,
        required: true
    },

    isApproved: {
        type: Boolean,
        default: false
    }

})

export const productRequestModel = model<ProductRequestType>("ProductRequest", productRequestSchema);