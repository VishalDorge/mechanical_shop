import { Document, Schema } from "mongoose";

export interface IShop {
    _id?: Schema.Types.ObjectId;
    owner: string;
    location: string;
    inventory?: string;
    reviews?: number[];
    rating: number;
}

export interface IShopCredentials {
    name: string;
    email: string;
    password: string;
    location: string;
}

export type ShopType = Document & IShop;