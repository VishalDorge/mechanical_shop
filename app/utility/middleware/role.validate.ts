import { NextFunction, Request, Response } from "express"

export const roleValidator = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { role } = res.locals.payload;
        if (allowedRoles.includes(role)) return next();
        else return next({ statusCode: 401, message: "ACCESS DENIED!!" });
    }
}