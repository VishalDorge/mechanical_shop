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
const rewardRequest_services_1 = __importDefault(require("./rewardRequest.services"));
const response_handler_1 = require("../../utility/response.handler");
const constant_1 = require("../../utility/constant");
const role_validate_1 = require("../../utility/middleware/role.validate");
const rewardRequest_validate_1 = require("./rewardRequest.validate");
const input_validate_1 = require("../../utility/middleware/input.validate");
const authorize_validate_1 = require("../../utility/middleware/authorize.validate");
const router = (0, express_1.Router)();
router.get("/", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN, constant_1.roles.OWNER]), rewardRequest_validate_1.GET_REWARD_REQUEST_VALIDATION, authorize_validate_1.shopAuthorization, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const result = yield rewardRequest_services_1.default.find(query);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.get("/history", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN, constant_1.roles.OWNER]), rewardRequest_validate_1.GET_REWARD_REQUEST_VALIDATION, authorize_validate_1.shopAuthorization, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const result = yield rewardRequest_services_1.default.rewardHistory(query);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.post("/", (0, role_validate_1.roleValidator)([constant_1.roles.OWNER]), rewardRequest_validate_1.CREATE_REWARD_REQUEST_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rewardId } = req.body;
        const ownerId = res.locals.payload.id;
        const result = yield rewardRequest_services_1.default.add(ownerId, rewardId);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.patch("/:id", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN]), input_validate_1.GLOBLE_PARAM_ID_VALIDATOR, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestId = req.params.id;
        const result = yield rewardRequest_services_1.default.approveRequest(requestId);
        res.status(result.statusCode || 500).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
router.delete("/:id", (0, role_validate_1.roleValidator)([constant_1.roles.OWNER]), input_validate_1.GLOBLE_PARAM_ID_VALIDATOR, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rewardRequestId = req.params.id;
        const result = yield rewardRequest_services_1.default.cancleRequest(rewardRequestId);
        res.status(result.statusCode || 500).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
