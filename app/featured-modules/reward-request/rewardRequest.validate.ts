import { body, param, query } from "express-validator";
import { inputValidator } from "../../utility/middleware/input.validate";

export const CREATE_REWARD_REQUEST_VALIDATION = [
    body("rewardId").isAlphanumeric().isLength({min: 1}).withMessage("RewardId Required!"),
    inputValidator
]

export const GET_REWARD_REQUEST_VALIDATION = [
    query("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    query("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    query("sortBy").optional().isString().isLength({min: 1}).withMessage("invalid entry for sortBy"),
    inputValidator
]