import { body, param, query } from "express-validator";
import { inputValidator } from "../../utility/middleware/input.validate";

export const CREATE_REWARD_VALIDATION = [
    body("name").isString().isLength({min: 1}).withMessage("Reward Name Required!"),
    body("points").isNumeric().withMessage("Invalid Reward Points"),
    inputValidator
]

export const GET_REWARD_VALIDATION = [
    query("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    query("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    query("sortBy").optional().isString().isLength({min: 1}).withMessage("invalid entry for sortBy"),
    inputValidator
]

export const CURRENT_REWARD_VALIDATION = [
    param("id").isAlphanumeric().isLength({min: 22}).withMessage("Invalid ShopId"),
    inputValidator
]

export const UPDATE_REWARD_VALIDATION = [
    body("rewardId").isAlphanumeric().isLength({min: 22}).withMessage("Invalid RewardId"),
    body("name").optional().isString().isLength({min: 1}).withMessage("Invalid Reward Name"),
    body("points").optional().isNumeric().withMessage("Invalid Reward Points"),
    inputValidator
]