"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST_PRODUCT_REQUEST_VALIDATION = exports.GET_PRODUCT_REQUEST_VALIDATION = exports.UPDATE_PRODUCT_REQUEST_VALIDATION = void 0;
const express_validator_1 = require("express-validator");
const input_validate_1 = require("../../utility/middleware/input.validate");
exports.UPDATE_PRODUCT_REQUEST_VALIDATION = [
    (0, express_validator_1.body)("productRequestId").isMongoId().withMessage("Invalid ProductRequestId!"),
    (0, express_validator_1.body)("productId").isMongoId().withMessage("Invalid ProductId!"),
    input_validate_1.inputValidator
];
exports.GET_PRODUCT_REQUEST_VALIDATION = [
    (0, express_validator_1.query)("page").optional().isInt().withMessage("Invalid Input for Page"),
    (0, express_validator_1.query)("limit").optional().isInt().withMessage("Invalid Input for Limit"),
    (0, express_validator_1.query)("sortBy").optional().isString().isLength({ min: 1 }).withMessage("invalid entry for sortBy"),
    input_validate_1.inputValidator
];
exports.POST_PRODUCT_REQUEST_VALIDATION = [
    (0, express_validator_1.body)("productList").isArray().isLength({ min: 1 }).withMessage("List of products required"),
    (0, express_validator_1.body)("productList.*.productId").isMongoId().withMessage("Invalid ProductId"),
    (0, express_validator_1.body)("productList.*.quantity").notEmpty().isInt().withMessage("Invalid Quantity for a Product"),
    input_validate_1.inputValidator
];
