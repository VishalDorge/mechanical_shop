import { model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { StatusType } from "./status.types";


const statusSchema = new BaseSchema({

    name: {
        type: String,
        unique: true
    }

});

export const statusModel = model<StatusType>("Status", statusSchema);