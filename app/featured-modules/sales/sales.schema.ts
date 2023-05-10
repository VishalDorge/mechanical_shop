import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { SalesType } from "./sales.types";

const salesSchema = new BaseSchema({

    shopId: {
        type: Schema.Types.ObjectId,
        ref: "Shop"
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },

    quantity: {
        type: Number
    },

    salesPrice: {
        type: Number
    },

    status: {
        type: Schema.Types.ObjectId,
        ref: "Status"
    }

})

export const salesModel = model<SalesType>("Sales", salesSchema);

import { statusModel } from "../status/status.schema";
statusModel.findOne();