"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponses = void 0;
exports.AuthResponses = {
    USER_NOT_FOUND: {
        message: "Email not Found",
        statusCode: 404
    },
    INVALID_CREDENTIALS: {
        message: "Wrong Password",
        statusCode: 400
    }
};
