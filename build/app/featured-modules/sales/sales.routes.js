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
const sales_services_1 = __importDefault(require("./sales.services"));
const response_handler_1 = require("../../utility/response.handler");
const constant_1 = require("../../utility/constant");
const role_validate_1 = require("../../utility/middleware/role.validate");
const sales_validate_1 = require("./sales.validate");
const input_validate_1 = require("../../utility/middleware/input.validate");
const authorize_validate_1 = require("../../utility/middleware/authorize.validate");
const router = (0, express_1.Router)();
router.get("/", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN, constant_1.roles.OWNER]), authorize_validate_1.shopAuthorization, sales_validate_1.GET_SALES_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const result = yield sales_services_1.default.find(query);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.get("/revenue", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN, constant_1.roles.OWNER]), authorize_validate_1.shopAuthorization, sales_validate_1.GET_SALES_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const result = yield sales_services_1.default.getRevenue(query);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.get("/leaders", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield sales_services_1.default.revenueLeaders();
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.get("/leader-by-product", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN]), sales_validate_1.GET_SALES_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const result = yield sales_services_1.default.productLeaders(query);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.post("/", (0, role_validate_1.roleValidator)([constant_1.roles.OWNER]), sales_validate_1.CREATE_SALES_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { salesList } = req.body;
        const ownerId = res.locals.payload.id;
        const result = yield sales_services_1.default.add(ownerId, salesList);
        res.status(result.statusCode || 500).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
router.patch("/verify", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN]), sales_validate_1.VERIFY_SALES_VALIDATION, authorize_validate_1.shopAuthorization, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { shopId, isApproved } = req.body;
        const query = req.query;
        const result = yield sales_services_1.default.verifySales(shopId, isApproved, query);
        res.status(result.statusCode || 500).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
router.patch("/", (0, role_validate_1.roleValidator)([constant_1.roles.OWNER]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { salesId, quantity } = req.body;
        const ownerId = res.locals.payload.id;
        const result = yield sales_services_1.default.updateSales(ownerId, salesId, quantity);
        res.status(result.statusCode || 500).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
router.delete("/:id", (0, role_validate_1.roleValidator)([constant_1.roles.OWNER]), input_validate_1.GLOBLE_PARAM_ID_VALIDATOR, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salesId = req.params.id;
        const ownerId = res.locals.payload.id;
        const result = yield sales_services_1.default.cancleSale(ownerId, salesId);
        res.status(result.statusCode).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
