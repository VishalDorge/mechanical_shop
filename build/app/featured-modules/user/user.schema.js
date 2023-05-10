"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utility/base.schema");
const userSchema = new base_schema_1.BaseSchema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Role"
    },
    points: {
        type: Number,
        default: 0
    }
});
exports.userModel = (0, mongoose_1.model)("User", userSchema);
const role_schema_1 = require("../role/role.schema");
role_schema_1.roleModel.findOne();
