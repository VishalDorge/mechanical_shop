import { FilterQuery } from "mongoose";
import { IStatus } from "./status.types";
import statusRepo from "./status.repo";


const findOne = (filter: FilterQuery<IStatus>) => statusRepo.findOne(filter);

const add = async (status: IStatus) => {
    const oldStatus = await findOne({_id: status._id});
    if(!oldStatus) statusRepo.add(status);
}

export default {
    findOne, add
}