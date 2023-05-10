"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLOBLE_PARAM_ID_VALIDATOR = exports.inputValidator = void 0;
const express_validator_1 = require("express-validator");
const inputValidator = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty())
        return next({ statusCode: 400, message: errors.array() });
    next();
};
exports.inputValidator = inputValidator;
exports.GLOBLE_PARAM_ID_VALIDATOR = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Invalid Value of Id"),
    exports.inputValidator
];
