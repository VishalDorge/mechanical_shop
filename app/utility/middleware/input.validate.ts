import { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";

export const inputValidator = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return next({statusCode: 400, message: errors.array()});
    next();
}

export const GLOBLE_PARAM_ID_VALIDATOR = [
    param("id").isMongoId().withMessage("Invalid Value of Id"),
    inputValidator
]