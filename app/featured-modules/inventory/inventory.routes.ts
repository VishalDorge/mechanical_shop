import { NextFunction, Request, Response, Router } from "express";
import { roles } from "../../utility/constant";
import { roleValidator } from "../../utility/middleware/role.validate";
import inventoryServices from "./inventory.services";
import { ResponseHandler } from "../../utility/response.handler";
import { GET_INVENTORY_VALIDATION, THRESHOLD_PRODUCT_VALIDATION } from "./inventory.validate";
import { IProductUpdate } from "./inventory.types";
import { GLOBLE_PARAM_ID_VALIDATOR } from "../../utility/middleware/input.validate";
import { shopAuthorization } from "../../utility/middleware/authorize.validate";

const router = Router();

router.get("/", roleValidator([roles.ADMIN, roles.OWNER]), GET_INVENTORY_VALIDATION, shopAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query;
            const result = await inventoryServices.find(query);
            res.send(new ResponseHandler(result))
        } catch (err) {
            next(err);
        }
    })

router.patch("/:id", roleValidator([roles.ADMIN, roles.OWNER]), GLOBLE_PARAM_ID_VALIDATOR, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shopId = req.params.id;
        const productUpdates: IProductUpdate[] = req.body.productUpdates;
        const result = await inventoryServices.updateInventory(shopId, productUpdates);
        res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
    } catch (err) {
        next(err);
    }
})

router.delete("/:id", roleValidator([roles.ADMIN, roles.OWNER]), GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const shopId = req.params.id;
            const result = await inventoryServices.remove(shopId);
            res.status(result.statusCode || 0).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

export default router;