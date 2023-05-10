import { NextFunction, Request, Response, Router } from "express";
import { roleValidator } from "../../utility/middleware/role.validate";
import { roles } from "../../utility/constant";
import userServices from "./user.services";
import { ResponseHandler } from "../../utility/response.handler";
import { GET_USER_VALIDATION, PATCH_USER_VALIDATION, POST_USER_VALIDATION } from "./user.validate";
import { ownerAuthorization } from "../../utility/middleware/authorize.validate";
import { GLOBLE_PARAM_ID_VALIDATOR } from "../../utility/middleware/input.validate";

const router = Router();

router.get("/leaders", roleValidator([roles.ADMIN]), GET_USER_VALIDATION, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const result = await userServices.pointLeaders(query);
        res.send(new ResponseHandler(result));
    } catch (err) {
        next(err);
    }
})

router.get("/", roleValidator([roles.ADMIN]), GET_USER_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query;
            const result = await userServices.find(query);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.post("/", roleValidator([roles.ADMIN]), POST_USER_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData = req.body;
            const result = await userServices.add(userData);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.patch("/", roleValidator([roles.ADMIN, roles.OWNER]),
    ownerAuthorization, PATCH_USER_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId, ...userData } = req.body;
            const result = await userServices.update({ _id: userId }, userData);
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

router.delete("/:id", roleValidator([roles.ADMIN]), GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.id;
            const result = await userServices.remove({_id: userId});
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

export default router;