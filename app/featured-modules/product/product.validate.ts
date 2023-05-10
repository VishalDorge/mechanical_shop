import { body, param, query } from "express-validator";
import { inputValidator } from "../../utility/middleware/input.validate";

export const CREATE_PRODUCT_VALIDATION = [
    body("name").isString().isLength({min: 1}).withMessage("Product name required"),
    body("price").isNumeric().withMessage("Invalid Product Price"),
    body("threshold").isNumeric().withMessage("Invalid Product Threshold"),
    body("points").optional().isNumeric().withMessage("Invalid Reward Points"),
    inputValidator
]

export const UPDATE_PRODUCT_VALIDATION = [
    body("productId").isAlphanumeric().isLength({min: 1}).withMessage("productId required"),
    body("price").optional().isNumeric().withMessage("Invalid Product Price"),
    body("threshold").optional().isNumeric().withMessage("Invalid Product Threshold"),
    body("points").optional().isNumeric().withMessage("Invalid Reward Points"),
    inputValidator
]


export const GET_PRODUCT_VALIDATION = [
    query("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    query("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    query("sortBy").optional().isString().isLength({min: 1}).withMessage("invalid entry for sortBy"),
    inputValidator
]