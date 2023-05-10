import { NextFunction, Request, Response, Router } from "express";
import rewardRequestServices from "./rewardRequest.services";
import { ResponseHandler } from "../../utility/response.handler";
import { roles } from "../../utility/constant";
import { roleValidator } from "../../utility/middleware/role.validate";
import { CREATE_REWARD_REQUEST_VALIDATION, GET_REWARD_REQUEST_VALIDATION } from "./rewardRequest.validate";
import { GLOBLE_PARAM_ID_VALIDATOR } from "../../utility/middleware/input.validate";
import { shopAuthorization } from "../../utility/middleware/authorize.validate";

const router = Router();

router.get("/", roleValidator([roles.ADMIN, roles.OWNER]),
    GET_REWARD_REQUEST_VALIDATION, shopAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query;
            const result = await rewardRequestServices.find(query);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.get("/history", roleValidator([roles.ADMIN, roles.OWNER]), GET_REWARD_REQUEST_VALIDATION, shopAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query;
            const result = await rewardRequestServices.rewardHistory(query);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.post("/", roleValidator([roles.OWNER]), CREATE_REWARD_REQUEST_VALIDATION,
    async (req: Request, res: Response, next: NextFunction
    ) => {
        try {
            const { rewardId } = req.body;
            const ownerId = res.locals.payload.id;
            const result = await rewardRequestServices.add(ownerId, rewardId);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.patch("/:id", roleValidator([roles.ADMIN]),
    GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction
    ) => {
        try {
            const requestId = req.params.id;
            const result = await rewardRequestServices.approveRequest(requestId);
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err);
        }
    })

router.delete("/:id", roleValidator([roles.OWNER]), GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rewardRequestId = req.params.id;
            const result = await rewardRequestServices.cancleRequest(rewardRequestId);
            res.status(result.statusCode || 500).send(new ResponseHandler(result.message));
        } catch (err) {
            next(err)
        }
    })

export default router;