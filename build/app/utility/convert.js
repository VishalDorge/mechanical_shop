"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertValuesToOriginalType = void 0;
const mongoose_1 = require("mongoose");
const convertValuesToOriginalType = (object) => {
    Object.keys(object).forEach(key => {
        if ((0, mongoose_1.isValidObjectId)(object[key]))
            object[key];
        else if (parseInt(object[key]))
            object[key] = parseInt(object[key]);
        else if (object[key] === "true" || object[key] === "false")
            object[key] = JSON.parse(object[key]);
        else if (typeof object[key] === 'object')
            (0, exports.convertValuesToOriginalType)(object[key]);
    });
};
exports.convertValuesToOriginalType = convertValuesToOriginalType;
