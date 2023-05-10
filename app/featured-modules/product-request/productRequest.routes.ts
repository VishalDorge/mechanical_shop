import { NextFunction, Request, Response, Router } from "express";
import productRequestServices from "./productRequest.services";
import { ResponseHandler } from "../../utility/response.handler";
import { roleValidator } from "../../utility/middleware/role.validate";
import { roles } from "../../utility/constant";
import { GET_PRODUCT_REQUEST_VALIDATION, POST_PRODUCT_REQUEST_VALIDATION, UPDATE_PRODUCT_REQUEST_VALIDATION } from "./productRequest.validate";
import { GLOBLE_PARAM_ID_VALIDATOR } from "../../utility/middleware/input.validate";
import { shopAuthorization } from "../../utility/middleware/authorize.validate";

const router = Router();

router.get("/", roleValidator([roles.ADMIN, roles.OWNER]), GET_PRODUCT_REQUEST_VALIDATION, shopAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query;
            const result = await productRequestServices.find(query);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.post("/", roleValidator([roles.OWNER]), POST_PRODUCT_REQUEST_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productList } = req.body;
            const ownerId = res.locals.payload.id;
            const result = await productRequestServices.add(ownerId, productList);
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

router.patch("/", roleValidator([roles.ADMIN, roles.OWNER]),
    UPDATE_PRODUCT_REQUEST_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {productRequestId, ...data} = req.body;
            const result = await productRequestServices.update({_id: productRequestId}, data); 
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

router.patch("/approve/:id", roleValidator([roles.ADMIN]), GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            const result = await productRequestServices.approveRequest(id);
            res.status(result.statusCode).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

router.delete("/:id", roleValidator([roles.ADMIN, roles.OWNER]),
    GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productRequestId = req.params.id;
            const result = await productRequestServices.remove({ _id: productRequestId });
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

export default router;