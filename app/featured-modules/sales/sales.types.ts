import { Document, Schema } from "mongoose";

export interface ISales {
    _id?: Schema.Types.ObjectId;
    shopId: string;
    productId: string;
    quantity: number;
    salesPrice: number;
    status: string;
}

export interface ISingleSale {
    productId: string;
    quantity: number;
}

export type SalesType = Document & ISales;