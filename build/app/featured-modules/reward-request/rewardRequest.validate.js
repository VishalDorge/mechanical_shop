"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_REWARD_REQUEST_VALIDATION = exports.CREATE_REWARD_REQUEST_VALIDATION = void 0;
const express_validator_1 = require("express-validator");
const input_validate_1 = require("../../utility/middleware/input.validate");
exports.CREATE_REWARD_REQUEST_VALIDATION = [
    (0, express_validator_1.body)("rewardId").isAlphanumeric().isLength({ min: 1 }).withMessage("RewardId Required!"),
    input_validate_1.inputValidator
];
exports.GET_REWARD_REQUEST_VALIDATION = [
    (0, express_validator_1.query)("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    (0, express_validator_1.query)("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    (0, express_validator_1.query)("sortBy").optional().isString().isLength({ min: 1 }).withMessage("invalid entry for sortBy"),
    input_validate_1.inputValidator
];
