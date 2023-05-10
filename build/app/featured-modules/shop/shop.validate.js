"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_SHOP_VALIDATION = exports.SHOP_RATING_VALIDATION = exports.GET_SHOP_VALIDATION = exports.CREATE_SHOP_VALIDATION = void 0;
const express_validator_1 = require("express-validator");
const input_validate_1 = require("../../utility/middleware/input.validate");
exports.CREATE_SHOP_VALIDATION = [
    (0, express_validator_1.body)("name").isString().isLength({ min: 1 }).withMessage("Name Required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email"),
    (0, express_validator_1.body)("password").isString().isLength({ min: 5 }).withMessage("Valid Password Required"),
    (0, express_validator_1.body)("location").isString().isLength({ min: 1 }).withMessage("Location Required"),
    input_validate_1.inputValidator
];
exports.GET_SHOP_VALIDATION = [
    (0, express_validator_1.query)("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    (0, express_validator_1.query)("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    (0, express_validator_1.query)("sortBy").optional().isString().isLength({ min: 1 }).withMessage("invalid entry for sortBy field"),
    input_validate_1.inputValidator
];
exports.SHOP_RATING_VALIDATION = [
    (0, express_validator_1.body)("rating").isInt().withMessage("Invalid value for rating"),
    (0, express_validator_1.body)("shopId").isMongoId().withMessage("invalid value for shopId"),
    input_validate_1.inputValidator
];
exports.UPDATE_SHOP_VALIDATION = [
    (0, express_validator_1.body)("shopId").isMongoId().withMessage("Invalid ShopId"),
    (0, express_validator_1.body)("owner").optional().isAlphanumeric().isLength({ min: 22 }).withMessage("Invalid ownerId"),
    (0, express_validator_1.body)("location").optional().isString().isLength({ min: 1 }).withMessage("Invalid Location Entry"),
    input_validate_1.inputValidator
];
