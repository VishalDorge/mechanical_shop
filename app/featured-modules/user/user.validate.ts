import { body, query } from "express-validator";
import { inputValidator } from "../../utility/middleware/input.validate";

export const GET_USER_VALIDATION = [
    query("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    query("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    query("sortBy").optional().isString().isLength({min: 1}).withMessage("invalid entry for sortBy field"),
    inputValidator
]

export const PATCH_USER_VALIDATION = [
    body("userId").isMongoId().withMessage("Valid userId missing!"),
    inputValidator
]

export const POST_USER_VALIDATION = [
    body("name").isString().isLength({min: 1}).withMessage("name required"),
    body("email").isEmail().withMessage("email required"),
    body("password").isString().isLength({min: 5}).withMessage("password required"),
    inputValidator
]
