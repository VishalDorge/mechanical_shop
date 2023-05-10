"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusModel = void 0;
const mongoose_1 = require("mongoose");
const base_schema_1 = require("../../utility/base.schema");
const statusSchema = new base_schema_1.BaseSchema({
    name: {
        type: String,
        unique: true
    }
});
exports.statusModel = (0, mongoose_1.model)("Status", statusSchema);
