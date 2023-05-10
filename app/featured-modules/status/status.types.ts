import { Document, Schema } from "mongoose";


export interface IStatus {
    _id?: Schema.Types.ObjectId | string;
    name: string;
}

export type StatusType = Document & IStatus;