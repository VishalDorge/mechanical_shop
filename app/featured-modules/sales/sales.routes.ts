import { NextFunction, Request, Response, Router } from "express";
import salesServices from "./sales.services";
import { ResponseHandler } from "../../utility/response.handler";
import { roles } from "../../utility/constant";
import { roleValidator } from "../../utility/middleware/role.validate";
import { CREATE_SALES_VALIDATION, GET_SALES_VALIDATION, VERIFY_SALES_VALIDATION } from "./sales.validate";
import { GLOBLE_PARAM_ID_VALIDATOR } from "../../utility/middleware/input.validate";
import { shopAuthorization } from "../../utility/middleware/authorize.validate";

const router = Router();

router.get("/", roleValidator([roles.ADMIN, roles.OWNER]), shopAuthorization, GET_SALES_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query;
            const result = await salesServices.find(query);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.get("/revenue", roleValidator([roles.ADMIN, roles.OWNER]), shopAuthorization, GET_SALES_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query;
            const result = await salesServices.getRevenue(query);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.get("/leaders", roleValidator([roles.ADMIN]), async (req, res, next) => {
    try {
        const result = await salesServices.revenueLeaders();
        res.send(new ResponseHandler(result));
    } catch (err) {
        next(err);
    }
})

router.get("/leader-by-product", roleValidator([roles.ADMIN]), GET_SALES_VALIDATION, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const result = await salesServices.productLeaders(query);
        res.send(new ResponseHandler(result));
    } catch (err) {
        next(err);
    }
})

router.post("/", roleValidator([roles.OWNER]), CREATE_SALES_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { salesList } = req.body;
            const ownerId = res.locals.payload.id;
            const result = await salesServices.add(ownerId, salesList);
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

router.patch("/verify", roleValidator([roles.ADMIN]), VERIFY_SALES_VALIDATION, shopAuthorization,
    async (req: Request, res: Response, next: NextFunction
    ) => {
        try {
            const { shopId, isApproved } = req.body;
            const query = req.query;
            const result = await salesServices.verifySales(shopId, isApproved, query);
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

router.patch("/", roleValidator([roles.OWNER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {salesId, quantity} = req.body;
            const ownerId = res.locals.payload.id;
            const result = await salesServices.updateSales(ownerId, salesId, quantity);
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

router.delete("/:id", roleValidator([roles.OWNER]), GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const salesId = req.params.id;
            const ownerId = res.locals.payload.id;
            const result = await salesServices.cancleSale(ownerId, salesId);
            res.status(result.statusCode).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

export default router;