import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { inventorySchema } from "../inventory/inventory.schema";
import { ShopType } from "./shop.types";

const shopSchema = new BaseSchema({

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    location: {
        type: String,
        required: true
    },

    inventory: {
        type: Schema.Types.ObjectId,
        ref: "Inventory",
        default: null
    },

    reviews: {
        type: [Number],
        default: []
    },

    rating: {
        type: Number,
        default: 0
    }

});

export const shopModel = model<ShopType>("Shop", shopSchema);