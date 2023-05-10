import { NextFunction, Request, Response, Router } from "express";
import productServices from "./product.services";
import { ResponseHandler } from "../../utility/response.handler";
import { roleValidator } from "../../utility/middleware/role.validate";
import { roles } from "../../utility/constant";
import { CREATE_PRODUCT_VALIDATION, GET_PRODUCT_VALIDATION, UPDATE_PRODUCT_VALIDATION } from "./product.validate";
import { GLOBLE_PARAM_ID_VALIDATOR } from "../../utility/middleware/input.validate";

const router = Router();

router.get("/", roleValidator([roles.ADMIN, roles.OWNER]), GET_PRODUCT_VALIDATION, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const result = await productServices.find(query);
        res.send(new ResponseHandler(result));
    } catch (err) {
        next(err);
    }
})

router.post("/", roleValidator([roles.ADMIN]), CREATE_PRODUCT_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const product = req.body;
            const result = await productServices.add(product);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    });

router.delete("/:id", roleValidator([roles.ADMIN]), GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId = req.params.id;
            const result = await productServices.remove({ _id: productId });
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    });

router.patch("/", roleValidator([roles.ADMIN]), UPDATE_PRODUCT_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId, ...productData } = req.body;
            const result = await productServices.update({ _id: productId }, productData);
            res.status(result.statusCode || 0).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

export default router;