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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reward_services_1 = __importDefault(require("./reward.services"));
const response_handler_1 = require("../../utility/response.handler");
const constant_1 = require("../../utility/constant");
const role_validate_1 = require("../../utility/middleware/role.validate");
const reward_validate_1 = require("./reward.validate");
const input_validate_1 = require("../../utility/middleware/input.validate");
const router = (0, express_1.Router)();
router.get("/", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN, constant_1.roles.OWNER]), reward_validate_1.GET_REWARD_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query;
        const result = yield reward_services_1.default.find(query);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.get("/owner-reward", (0, role_validate_1.roleValidator)([constant_1.roles.OWNER]), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ownerId = res.locals.payload.id;
        const result = yield reward_services_1.default.currentReward(ownerId);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.post("/", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN]), reward_validate_1.CREATE_REWARD_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reward = req.body;
        const result = yield reward_services_1.default.add(reward);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.delete("/:id", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN]), input_validate_1.GLOBLE_PARAM_ID_VALIDATOR, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rewardId = req.params.id;
        const result = yield reward_services_1.default.remove({ _id: rewardId });
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.patch("/", (0, role_validate_1.roleValidator)([constant_1.roles.ADMIN]), reward_validate_1.UPDATE_REWARD_VALIDATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.body, { rewardId } = _a, rewardData = __rest(_a, ["rewardId"]);
        const result = yield reward_services_1.default.update({ _id: rewardId }, rewardData);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
