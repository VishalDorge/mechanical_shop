"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THRESHOLD_PRODUCT_VALIDATION = exports.GET_INVENTORY_VALIDATION = void 0;
const express_validator_1 = require("express-validator");
const input_validate_1 = require("../../utility/middleware/input.validate");
exports.GET_INVENTORY_VALIDATION = [
    (0, express_validator_1.query)("shopId").optional().isAlphanumeric().isLength({ min: 22 }).withMessage("Invalid ShopId!"),
    (0, express_validator_1.query)("sortBy").optional().isString().isLength({ min: 1 }).withMessage("Invalid Value for sorting field!"),
    (0, express_validator_1.query)("page").optional().isNumeric().withMessage("Invalid value of page"),
    (0, express_validator_1.query)("limit").optional().isNumeric().withMessage("Invalid value of lmit"),
    input_validate_1.inputValidator
];
exports.THRESHOLD_PRODUCT_VALIDATION = [
    (0, express_validator_1.param)("shopId").isAlphanumeric().isLength({ min: 22 }).withMessage("Invalid ShopId"),
    input_validate_1.inputValidator
];
