"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST_USER_VALIDATION = exports.PATCH_USER_VALIDATION = exports.GET_USER_VALIDATION = void 0;
const express_validator_1 = require("express-validator");
const input_validate_1 = require("../../utility/middleware/input.validate");
exports.GET_USER_VALIDATION = [
    (0, express_validator_1.query)("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    (0, express_validator_1.query)("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    (0, express_validator_1.query)("sortBy").optional().isString().isLength({ min: 1 }).withMessage("invalid entry for sortBy field"),
    input_validate_1.inputValidator
];
exports.PATCH_USER_VALIDATION = [
    (0, express_validator_1.body)("userId").isMongoId().withMessage("Valid userId missing!"),
    input_validate_1.inputValidator
];
exports.POST_USER_VALIDATION = [
    (0, express_validator_1.body)("name").isString().isLength({ min: 1 }).withMessage("name required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("email required"),
    (0, express_validator_1.body)("password").isString().isLength({ min: 5 }).withMessage("password required"),
    input_validate_1.inputValidator
];
