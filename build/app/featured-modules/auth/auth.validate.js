"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERATE_TOKEN_VALIDATION = exports.CREATE_ADMIN_VALIDATION = exports.LOGIN_VALIDATION = void 0;
const express_validator_1 = require("express-validator");
const input_validate_1 = require("../../utility/middleware/input.validate");
exports.LOGIN_VALIDATION = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email!"),
    (0, express_validator_1.body)("password").isLength({ min: 5 }).withMessage("Invalid Password"),
    input_validate_1.inputValidator
];
exports.CREATE_ADMIN_VALIDATION = [
    (0, express_validator_1.body)("name").isString().isLength({ min: 1 }).withMessage("Name Required!"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid Email!"),
    (0, express_validator_1.body)("password").isLength({ min: 5 }).withMessage("Invalid Password"),
    input_validate_1.inputValidator
];
exports.GENERATE_TOKEN_VALIDATION = [
    (0, express_validator_1.body)("refreshToken").isString().isLength({ min: 50 }).withMessage("Valid refresh token required"),
    input_validate_1.inputValidator
];
