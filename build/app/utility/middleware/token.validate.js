"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcludedPath = exports.tokenValidator = void 0;
const key_generate_1 = require("../key.generate");
const jsonwebtoken_1 = require("jsonwebtoken");
const tokenValidator = (excludedPaths) => {
    return (req, res, next) => {
        var _a;
        try {
            if (excludedPaths.find(e => {
                if (req.url === e.url && req.method === e.method) {
                    if (e.excludeFromExcludePath.length === 0)
                        return true;
                    else if (req.url.slice(e.url.length).startsWith("?"))
                        return true;
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
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (!token)
                return next({ message: "Unauthorize", statusCode: 401 });
            const publicKey = (0, key_generate_1.getPublicKey)();
            const payload = (0, jsonwebtoken_1.verify)(token, publicKey || "");
            if (payload.type === 1)
                return next({ message: "Unable to Proceed", statusCode: 400 });
            res.locals.payload = payload;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.tokenValidator = tokenValidator;
class ExcludedPath {
    constructor(url, method, ...excludeFromExcludePath) {
        this.url = url;
        this.method = method;
        this.excludeFromExcludePath = [];
        this.excludeFromExcludePath = excludeFromExcludePath;
    }
}
exports.ExcludedPath = ExcludedPath;
