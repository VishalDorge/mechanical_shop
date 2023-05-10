import { NextFunction, Request, Response, Router } from "express";
import rewardServices from "./reward.services";
import { ResponseHandler } from "../../utility/response.handler";
import { roles } from "../../utility/constant";
import { roleValidator } from "../../utility/middleware/role.validate";
import { CREATE_REWARD_VALIDATION, CURRENT_REWARD_VALIDATION, GET_REWARD_VALIDATION, UPDATE_REWARD_VALIDATION } from "./reward.validate";
import { GLOBLE_PARAM_ID_VALIDATOR } from "../../utility/middleware/input.validate";

const router = Router();

router.get("/", roleValidator([roles.ADMIN, roles.OWNER]), GET_REWARD_VALIDATION,
    async (req: Request, res: Response, next: NextFunction
    ) => {
        try {
            const query = req.query;
            const result = await rewardServices.find(query);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.get("/owner-reward", roleValidator([roles.OWNER]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ownerId = res.locals.payload.id;
            const result = await rewardServices.currentReward(ownerId);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.post("/", roleValidator([roles.ADMIN]), CREATE_REWARD_VALIDATION,
    async (req: Request, res: Response, next: NextFunction
    ) => {
        try {
            const reward = req.body;
            const result = await rewardServices.add(reward);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.delete("/:id", roleValidator([roles.ADMIN]), GLOBLE_PARAM_ID_VALIDATOR,
    async (req: Request, res: Response, next: NextFunction
    ) => {
        try {
            const rewardId = req.params.id;
            const result = await rewardServices.remove({ _id: rewardId });
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

router.patch("/", roleValidator([roles.ADMIN]), UPDATE_REWARD_VALIDATION,
    async (req: Request, res: Response, next: NextFunction
    ) => {
        try {
            const { rewardId, ...rewardData } = req.body;
            const result = await rewardServices.update({ _id: rewardId }, rewardData);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

export default router;