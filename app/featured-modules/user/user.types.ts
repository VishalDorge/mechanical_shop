import { Document, Schema } from "mongoose";
import { IShop } from "../shop/shop.types";

export interface IUser {
    _id?: Schema.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role?: string;
    points?: number;
}

export type UserType = Document & IUser;