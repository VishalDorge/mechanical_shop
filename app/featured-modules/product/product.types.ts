import { Document, Schema } from "mongoose";


export interface IProduct {
    _id?: Schema.Types.ObjectId;
    name: string;
    price: number;
    threshold: number;
    points?: number;
    isSpecial?: boolean;
}

export type ProductType = Document & IProduct;