import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { InventoryType } from "./inventory.types";


export const inventorySchema = new BaseSchema({

    product: {
        type: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product"
                },
            
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }

})

export const inventoryModel = model<InventoryType>("Inventory", inventorySchema);