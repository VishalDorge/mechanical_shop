import { model } from "mongoose";
import { BaseSchema } from "../../utility/base.schema";
import { RoleType } from "./role.types";

const roleSchema = new BaseSchema({
    name: {
        type: String
    }
});

export const roleModel = model<RoleType>("Role", roleSchema);