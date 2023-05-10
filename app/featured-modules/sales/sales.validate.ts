import { body, query } from "express-validator";
import { inputValidator } from "../../utility/middleware/input.validate";

export const VERIFY_SALES_VALIDATION = [
    body("isApproved").isBoolean().withMessage("Invalid Status"),
    body("shopId").isAlphanumeric().isLength({min: 22}).withMessage("Invalid ShopId"),
    inputValidator
]

export const CREATE_SALES_VALIDATION = [
    body("salesList").isArray().isLength({min: 1}).withMessage("List of products required"),
    body("salesList.*.productId").isMongoId().withMessage("Invalid ProductId"),
    body("salesList.*.quantity").isInt().withMessage("Invalid Value of Product Quantity"),
    inputValidator
]

export const GET_SALES_VALIDATION = [
    query("sortBy").optional().isString().isLength({min: 1}).withMessage("Invalid Value for sorting field!"),
    query("page").optional().isNumeric().withMessage("Invalid value of page"),
    query("limit").optional().isNumeric().withMessage("Invalid value of lmit"),
    inputValidator
]