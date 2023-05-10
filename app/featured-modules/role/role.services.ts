import { FilterQuery } from "mongoose";
import roleRepo from "./role.repo";
import { IRole } from "./role.types";

const findOne = (filter: FilterQuery<IRole>) => roleRepo.findOne(filter);
const add = async (role: IRole) => {
    const oldRole = await findOne({_id: role._id});
    if(!oldRole) roleRepo.add(role); 
}

export default {
    findOne, add
}