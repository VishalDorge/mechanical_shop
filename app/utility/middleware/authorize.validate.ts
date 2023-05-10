import { NextFunction, Request, Response } from "express";
import { roles } from "../constant";
import shopServices from "../../featured-modules/shop/shop.services";


export const shopAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, role } = res.locals.payload;
    if (role === roles.ADMIN) return next();

    const shopId = req.params.id ? req.params.id : req.body.shopId ? req.body.shopId : req.query.shopId ? req.query.shopId : null;

    const shop = await shopServices.findOne({ _id: shopId, owner: id });
    if (shop) return next();
    else return next({ statusCode: 401, message: "ACCESS DENIED!!!!" });
}

export const ownerAuthorization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { id, role } = res.locals.payload;
    if (role === roles.ADMIN) return next();

    const { userId } = req.body;
    if (id === userId) {
        if (!req.body.points && !req.body.role && !req.body.password) return next();
        else return next({ statusCode: 403, message: "FORBIDDEN" })
    } else return next({ statusCode: 401, message: "ACCESS DENIED!!!!" });
}