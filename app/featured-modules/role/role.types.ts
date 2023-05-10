import { Document, Schema } from "mongoose";


export interface IRole {
    _id?: Schema.Types.ObjectId | string;
    name: string;
}

export type RoleType = Document & IRole;