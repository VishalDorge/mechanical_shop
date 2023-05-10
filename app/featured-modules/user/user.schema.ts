import { Schema, model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { UserType } from "./user.types";

const userSchema = new BaseSchema({

    name: {
        type: String
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: Schema.Types.ObjectId,
        ref: "Role"
    },

    points: {
        type: Number,
        default: 0
    }

});

export const userModel = model<UserType>("User", userSchema);

import { roleModel } from "../role/role.schema";
roleModel.findOne();