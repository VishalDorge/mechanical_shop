import { FilterQuery } from "mongoose";
import { IStatus } from "./status.types";
import { statusModel } from "./status.schema";


const findOne = (filter: FilterQuery<IStatus>) => statusModel.findOne(filter);
const add = (status: IStatus) => statusModel.create(status);

export default {
    findOne, add
}