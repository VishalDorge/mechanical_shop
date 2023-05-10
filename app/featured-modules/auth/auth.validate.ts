import { body } from "express-validator";
import { inputValidator } from "../../utility/middleware/input.validate";

export const LOGIN_VALIDATION = [
    body("email").isEmail().withMessage("Invalid Email!"),
    body("password").isLength({min: 5}).withMessage("Invalid Password"),
    inputValidator
]

export const CREATE_ADMIN_VALIDATION = [
    body("name").isString().isLength({min: 1}).withMessage("Name Required!"),
    body("email").isEmail().withMessage("Invalid Email!"),
    body("password").isLength({min: 5}).withMessage("Invalid Password"),
    inputValidator
]

export const GENERATE_TOKEN_VALIDATION = [
    body("refreshToken").isString().isLength({min: 50}).withMessage("Valid refresh token required"),
    inputValidator
]