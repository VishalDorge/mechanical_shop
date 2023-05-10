import { Document, Schema } from "mongoose";


export interface IProductRequest {
    _id?: Schema.Types.ObjectId;
    shopId: string;
    productId: string;
    quantity: number;
}

export type ProductRequestType = Document & IProductRequest

export interface ISingleOrder {
    productId: string;
    quantity: number;
}