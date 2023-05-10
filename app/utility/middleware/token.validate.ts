import { Request, Response, NextFunction } from "express";
import { getPublicKey } from "../key.generate";
import { JwtPayload, verify } from "jsonwebtoken";

export const tokenValidator = (excludedPaths: ExcludedPath[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (excludedPaths.find(e => {
                if (req.url === e.url && req.method === e.method) {
                    if (e.excludeFromExcludePath.length === 0) return true;
                    else if (req.url.slice(e.url.length).startsWith("?")) return true;
                    const params = req.url.replace(e.url, "").split("/").slice(1);
                    for (let arr of e.excludeFromExcludePath) {
                        if (JSON.stringify(params) === JSON.stringify(arr)) {
                            return true;
                        }
                    }
                }
            })) {
                return next();
            }
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return next({ message: "Unauthorize", statusCode: 401 });

            const publicKey = getPublicKey();
            const payload = verify(token, publicKey || "") as JwtPayload;
            if (payload.type === 1) return next({ message: "Unable to Proceed", statusCode: 400 });
            res.locals.payload = payload;
            next();

        } catch (error) {
            next(error);
        }
    }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export class ExcludedPath {
    excludeFromExcludePath: string[][] = [];
    constructor(public url: string, public method: Method, ...excludeFromExcludePath: string[][]) {
        this.excludeFromExcludePath = excludeFromExcludePath;
    }
}