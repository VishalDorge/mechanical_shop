"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_services_1 = __importDefault(require("./auth.services"));
const response_handler_1 = require("../../utility/response.handler");
const role_validate_1 = require("../../utility/middleware/role.validate");
const constant_1 = require("../../utility/constant");
const auth_validate_1 = require("./auth.validate");
const router = (0, express_1.Router)();
router.post("/register-admin", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN]), auth_validate_1.CREATE_ADMIN_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const result = yield auth_services_1.default.createAdmin(user);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.post("/login", auth_validate_1.LOGIN_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const credentials = req.body;
        const result = yield auth_services_1.default.login(credentials);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.post("/token", auth_validate_1.GENERATE_TOKEN_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        const result = yield auth_services_1.default.generateAccessToken(refreshToken);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
