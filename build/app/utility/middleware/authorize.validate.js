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
exports.ownerAuthorization = exports.shopAuthorization = void 0;
const constant_1 = require("../constant");
const shop_services_1 = __importDefault(require("../../featured-modules/shop/shop.services"));
const shopAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = res.locals.payload;
    if (role === constant_1.roles.ADMIN)
        return next();
    const shopId = req.params.id ? req.params.id : req.body.shopId ? req.body.shopId : req.query.shopId ? req.query.shopId : null;
    const shop = yield shop_services_1.default.findOne({ _id: shopId, owner: id });
    if (shop)
        return next();
    else
        return next({ statusCode: 401, message: "ACCESS DENIED!!!!" });
});
exports.shopAuthorization = shopAuthorization;
const ownerAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = res.locals.payload;
    if (role === constant_1.roles.ADMIN)
        return next();
    const { userId } = req.body;
    if (id === userId) {
        if (!req.body.points && !req.body.role && !req.body.password)
            return next();
        else
            return next({ statusCode: 403, message: "FORBIDDEN" });
    }
    else
        return next({ statusCode: 401, message: "ACCESS DENIED!!!!" });
});
exports.ownerAuthorization = ownerAuthorization;
