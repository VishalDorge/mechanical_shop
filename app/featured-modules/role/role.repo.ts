import { FilterQuery } from "mongoose";
import { roleModel } from "./role.schema";
import { IRole } from "./role.types";

const findOne = (filter: FilterQuery<IRole>) => roleModel.findOne(filter);
const add = (role: IRole) => roleModel.create(role);

export default {
    findOne, add
}