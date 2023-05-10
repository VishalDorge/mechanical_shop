import { Document, Schema } from "mongoose";

export interface IInventory {
    _id?: Schema.Types.ObjectId;
    product: ISingleOrder[];
}

export type InventoryType = Document & IInventory;

export interface ISingleOrder {
    _id?: Schema.Types.ObjectId;
    productId: string;
    quantity: number;
}

export interface IProductUpdate {
    productId: string;
    quantity: number;
}