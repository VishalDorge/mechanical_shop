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
const constant_1 = require("../../utility/constant");
const role_validate_1 = require("../../utility/middleware/role.validate");
const inventory_services_1 = __importDefault(require("./inventory.services"));
const response_handler_1 = require("../../utility/response.handler");
const inventory_validate_1 = require("./inventory.validate");
const input_validate_1 = require("../../utility/middleware/input.validate");
const authorize_validate_1 = require("../../utility/middleware/authorize.validate");
const router = (0, express_1.Router)();
router.get("/", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN, constant_1.roles.OWNER]), inventory_validate_1.GET_INVENTORY_VALIDATION, authorize_validate_1.shopAuthorization, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const result = yield inventory_services_1.default.find(query);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.patch("/:id", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN, constant_1.roles.OWNER]), input_validate_1.GLOBLE_PARAM_ID_VALIDATOR, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shopId = req.params.id;
        const productUpdates = req.body.productUpdates;
        const result = yield inventory_services_1.default.updateInventory(shopId, productUpdates);
        res.status(result.statusCode || 500).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
router.delete("/:id", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN, constant_1.roles.OWNER]), input_validate_1.GLOBLE_PARAM_ID_VALIDATOR, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shopId = req.params.id;
        const result = yield inventory_services_1.default.remove(shopId);
        res.status(result.statusCode || 0).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
