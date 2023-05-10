import { body, param, query } from "express-validator";
import { inputValidator } from "../../utility/middleware/input.validate";

export const GET_INVENTORY_VALIDATION = [
    query("shopId").optional().isAlphanumeric().isLength({min: 22}).withMessage("Invalid ShopId!"),
    query("sortBy").optional().isString().isLength({min: 1}).withMessage("Invalid Value for sorting field!"),
    query("page").optional().isNumeric().withMessage("Invalid value of page"),
    query("limit").optional().isNumeric().withMessage("Invalid value of lmit"),
    inputValidator
]

export const THRESHOLD_PRODUCT_VALIDATION = [
    param("shopId").isAlphanumeric().isLength({min: 22}).withMessage("Invalid ShopId"),
    inputValidator
];