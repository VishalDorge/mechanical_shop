"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleValidator = void 0;
const roleValidator = (allowedRoles) => {
    return (req, res, next) => {
        const { role } = res.locals.payload;
        if (allowedRoles.includes(role))
            return next();
        else
            return next({ statusCode: 401, message: "ACCESS DENIED!!" });
    };
};
exports.roleValidator = roleValidator;
