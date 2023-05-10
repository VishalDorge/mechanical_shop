"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_SALES_VALIDATION = exports.CREATE_SALES_VALIDATION = exports.VERIFY_SALES_VALIDATION = void 0;
const express_validator_1 = require("express-validator");
const input_validate_1 = require("../../utility/middleware/input.validate");
exports.VERIFY_SALES_VALIDATION = [
    (0, express_validator_1.body)("isApproved").isBoolean().withMessage("Invalid Status"),
    (0, express_validator_1.body)("shopId").isAlphanumeric().isLength({ min: 22 }).withMessage("Invalid ShopId"),
    input_validate_1.inputValidator
];
exports.CREATE_SALES_VALIDATION = [
    (0, express_validator_1.body)("salesList").isArray().isLength({ min: 1 }).withMessage("List of products required"),
    (0, express_validator_1.body)("salesList.*.productId").isMongoId().withMessage("Invalid ProductId"),
    (0, express_validator_1.body)("salesList.*.quantity").isInt().withMessage("Invalid Value of Product Quantity"),
    input_validate_1.inputValidator
];
exports.GET_SALES_VALIDATION = [
    (0, express_validator_1.query)("sortBy").optional().isString().isLength({ min: 1 }).withMessage("Invalid Value for sorting field!"),
    (0, express_validator_1.query)("page").optional().isNumeric().withMessage("Invalid value of page"),
    (0, express_validator_1.query)("limit").optional().isNumeric().withMessage("Invalid value of lmit"),
    input_validate_1.inputValidator
];
