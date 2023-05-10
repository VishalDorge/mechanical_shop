"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_PRODUCT_VALIDATION = exports.UPDATE_PRODUCT_VALIDATION = exports.CREATE_PRODUCT_VALIDATION = void 0;
const express_validator_1 = require("express-validator");
const input_validate_1 = require("../../utility/middleware/input.validate");
exports.CREATE_PRODUCT_VALIDATION = [
    (0, express_validator_1.body)("name").isString().isLength({ min: 1 }).withMessage("Product name required"),
    (0, express_validator_1.body)("price").isNumeric().withMessage("Invalid Product Price"),
    (0, express_validator_1.body)("threshold").isNumeric().withMessage("Invalid Product Threshold"),
    (0, express_validator_1.body)("points").optional().isNumeric().withMessage("Invalid Reward Points"),
    input_validate_1.inputValidator
];
exports.UPDATE_PRODUCT_VALIDATION = [
    (0, express_validator_1.body)("productId").isAlphanumeric().isLength({ min: 1 }).withMessage("productId required"),
    (0, express_validator_1.body)("price").optional().isNumeric().withMessage("Invalid Product Price"),
    (0, express_validator_1.body)("threshold").optional().isNumeric().withMessage("Invalid Product Threshold"),
    (0, express_validator_1.body)("points").optional().isNumeric().withMessage("Invalid Reward Points"),
    input_validate_1.inputValidator
];
exports.GET_PRODUCT_VALIDATION = [
    (0, express_validator_1.query)("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    (0, express_validator_1.query)("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    (0, express_validator_1.query)("sortBy").optional().isString().isLength({ min: 1 }).withMessage("invalid entry for sortBy"),
    input_validate_1.inputValidator
];
