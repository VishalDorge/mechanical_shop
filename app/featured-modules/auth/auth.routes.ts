import { NextFunction, Request, Response, Router } from "express";
import authServices from "./auth.services";
import { ResponseHandler } from "../../utility/response.handler";
import { roleValidator } from "../../utility/middleware/role.validate";
import { roles } from "../../utility/constant";
import { CREATE_ADMIN_VALIDATION, GENERATE_TOKEN_VALIDATION, LOGIN_VALIDATION } from "./auth.validate";

const router = Router();

router.post("/register-admin", roleValidator([roles.ADMIN]), CREATE_ADMIN_VALIDATION, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.body;
        const result = await authServices.createAdmin(user);
        res.send(new ResponseHandler(result));
    } catch (err) {
        next(err);
    }
});

router.post("/login", LOGIN_VALIDATION, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const credentials = req.body;
        const result = await authServices.login(credentials);
        res.send(new ResponseHandler(result));
    } catch (err) {
        next(err);
    }
});

router.post("/token", GENERATE_TOKEN_VALIDATION,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            const result = await authServices.generateAccessToken(refreshToken);
            res.send(new ResponseHandler(result));
        } catch (err) {
            next(err);
        }
    })

export default router;