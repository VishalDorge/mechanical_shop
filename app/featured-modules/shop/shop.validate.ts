import { body, param, query } from "express-validator";
import { inputValidator } from "../../utility/middleware/input.validate";

export const CREATE_SHOP_VALIDATION = [
    body("name").isString().isLength({min: 1}).withMessage("Name Required"),
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isString().isLength({min: 5}).withMessage("Valid Password Required"),
    body("location").isString().isLength({min: 1}).withMessage("Location Required"),
    inputValidator
]


export const GET_SHOP_VALIDATION = [
    query("page").optional().isNumeric().withMessage("Invalid Input for Page"),
    query("limit").optional().isNumeric().withMessage("Invalid Input for Limit"),
    query("sortBy").optional().isString().isLength({min: 1}).withMessage("invalid entry for sortBy field"),
    inputValidator
]

export const SHOP_RATING_VALIDATION = [
    body("rating").isInt().withMessage("Invalid value for rating"),
    body("shopId").isMongoId().withMessage("invalid value for shopId"),
    inputValidator
]

export const UPDATE_SHOP_VALIDATION = [
    body("shopId").isMongoId().withMessage("Invalid ShopId"),
    body("owner").optional().isAlphanumeric().isLength({min: 22}).withMessage("Invalid ownerId"),
    body("location").optional().isString().isLength({min: 1}).withMessage("Invalid Location Entry"),
    inputValidator
]