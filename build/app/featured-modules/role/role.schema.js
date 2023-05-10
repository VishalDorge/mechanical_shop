"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utility/base.schema");
const roleSchema = new base_schema_1.BaseSchema({
    name: {
        type: String
    }
});
exports.roleModel = (0, mongoose_1.model)("Role", roleSchema);
