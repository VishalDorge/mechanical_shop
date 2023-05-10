import { NextFunction, Request, Response, Router } from "express";
import shopServices from "./shop.services";
import { ResponseHandler } from "../../utility/response.handler";
import { roles } from "../../utility/constant";
import { roleValidator } from "../../utility/middleware/role.validate";
import { CREATE_SHOP_VALIDATION, GET_SHOP_VALIDATION, SHOP_RATING_VALIDATION, UPDATE_SHOP_VALIDATION } from "./shop.validate";
import { GLOBLE_PARAM_ID_VALIDATOR } from "../../utility/middleware/input.validate";

const router = Router();

router.get("/", GET_SHOP_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query;
            const result = await shopServices.find(query);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.get("/threshold", roleValidator([roles.ADMIN]), GET_SHOP_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query;
            const result = await shopServices.thresholdProducts(query);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.post("/", roleValidator([roles.ADMIN]), CREATE_SHOP_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopCredentials = req.body;
            const result = await shopServices.add(shopCredentials);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.post("/rating", SHOP_RATING_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { shopId, rating } = req.body;
            const result = await shopServices.customerRating(shopId, rating);
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

router.delete("/:id", roleValidator([roles.ADMIN]), GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = req.params.id;
            const result = await shopServices.remove({ _id: shopId });
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.patch("/", roleValidator([roles.ADMIN]), UPDATE_SHOP_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { shopId, ...shopData } = req.body;
            const result = await shopServices.update({ _id: shopId }, shopData);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

export default router;