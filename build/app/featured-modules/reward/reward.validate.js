"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_REWARD_VALIDATION = exports.CURRENT_REWARD_VALIDATION = exports.GET_REWARD_VALIDATION = exports.CREATE_REWARD_VALIDATION = void 0;
const express_validator_1 = require("express-validator");
const input_validate_1 = require("../../utility/middleware/input.validate");
exports.CREATE_REWARD_VALIDATION = [
    (0, express_validator_1.body)("name").isString().isLength({ min: 1 }).withMessage("Reward Name Required!"),
    (0, express_validator_1.body)("points").isNumeric().withMessage("Invalid Reward Points"),
    input_validate_1.inputValidator
];
exports.GET_REWARD_VALIDATION = [
    (0, express_validator_1.query)("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    (0, express_validator_1.query)("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    (0, express_validator_1.query)("sortBy").optional().isString().isLength({ min: 1 }).withMessage("invalid entry for sortBy"),
    input_validate_1.inputValidator
];
exports.CURRENT_REWARD_VALIDATION = [
    (0, express_validator_1.param)("id").isAlphanumeric().isLength({ min: 22 }).withMessage("Invalid ShopId"),
    input_validate_1.inputValidator
];
exports.UPDATE_REWARD_VALIDATION = [
    (0, express_validator_1.body)("rewardId").isAlphanumeric().isLength({ min: 22 }).withMessage("Invalid RewardId"),
    (0, express_validator_1.body)("name").optional().isString().isLength({ min: 1 }).withMessage("Invalid Reward Name"),
    (0, express_validator_1.body)("points").optional().isNumeric().withMessage("Invalid Reward Points"),
    input_validate_1.inputValidator
];
