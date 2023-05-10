import { body, param, query } from "express-validator";
import { inputValidator } from "../../utility/middleware/input.validate";

export const UPDATE_PRODUCT_REQUEST_VALIDATION = [
    body("productRequestId").isMongoId().withMessage("Invalid ProductRequestId!"),
    body("productId").isMongoId().withMessage("Invalid ProductId!"),
    inputValidator
]

export const GET_PRODUCT_REQUEST_VALIDATION = [
    query("page").optional().isInt().withMessage("Invalid Input for Page"),
    query("limit").optional().isInt().withMessage("Invalid Input for Limit"),
    query("sortBy").optional().isString().isLength({min: 1}).withMessage("invalid entry for sortBy"),
    inputValidator
]

export const POST_PRODUCT_REQUEST_VALIDATION = [
    body("productList").isArray().isLength({min: 1}).withMessage("List of products required"),
    body("productList.*.productId").isMongoId().withMessage("Invalid ProductId"),
    body("productList.*.quantity").notEmpty().isInt().withMessage("Invalid Quantity for a Product"),
    inputValidator
]