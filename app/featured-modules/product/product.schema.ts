import { model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { ProductType } from "./product.types";

const productSchema = new BaseSchema({

    name: {
        type: String,
        unique: true,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    threshold: {
        type: Number,
        required: true
    },

    isSpecial: {
        type: Boolean,
        default: false
    },

    points: {
        type: Number,
        default: 0
    }
});

export const productModel = model<ProductType>("Product", productSchema);