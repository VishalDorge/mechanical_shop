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
const productRequest_services_1 = __importDefault(require("./productRequest.services"));
const response_handler_1 = require("../../utility/response.handler");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.params;
        const result = yield productRequest_services_1.default.find(query);
        res.send(new response_handler_1.ResponseHandler(result));
    }
    catch (err) {
        next(err);
    }
}));
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productList } = req.body;
        const ownerId = res.locals.payload.id;
        const result = yield productRequest_services_1.default.add(ownerId, productList);
        res.status(result.statusCode || 500).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
router.patch("/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productRequestId = req.params.id;
        const result = yield productRequest_services_1.default.customApprove(productRequestId);
        res.status(result.statusCode).send(new response_handler_1.ResponseHandler(result.message));
    }
    catch (err) {
        next(err);
    }
}));
exports.default = router;
