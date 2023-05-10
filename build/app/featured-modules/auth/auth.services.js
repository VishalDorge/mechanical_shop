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
const bcryptjs_1 = require("bcryptjs");
const auth_responses_1 = require("./auth.responses");
const key_generate_1 = require("../../utility/key.generate");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_services_1 = __importDefault(require("../user/user.services"));
const constant_1 = require("../../utility/constant");
const encryptPassword = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield (0, bcryptjs_1.genSalt)(10);
    const hashedPassword = yield (0, bcryptjs_1.hash)(user.password, salt);
    user.password = hashedPassword;
    return user;
});
const createAdmin = (user) => {
    user.role = constant_1.roles.ADMIN;
    return register(user);
};
const createOwner = (user) => {
    user.role = constant_1.roles.OWNER;
    return register(user);
};
const register = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user = yield encryptPassword(user);
    const result = user_services_1.default.add(user);
    return result;
});
const login = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_services_1.default.findOne({ email: credentials.email });
    if (!user)
        throw auth_responses_1.AuthResponses.USER_NOT_FOUND;
    const isPasswordMatched = yield (0, bcryptjs_1.compare)(credentials.password, user.password);
    if (!isPasswordMatched)
        throw auth_responses_1.AuthResponses.INVALID_CREDENTIALS;
    const privateKey = (0, key_generate_1.getPrivateKey)();
    const accessToken = (0, jsonwebtoken_1.sign)({ id: user._id, role: user.role }, privateKey, { algorithm: "RS256", expiresIn: "1h" });
    const refreshToken = (0, jsonwebtoken_1.sign)({ id: user._id, role: user.role, type: 1 }, privateKey, { algorithm: "RS256" });
    return { role: user.role, accessToken, refreshToken };
});
const generateAccessToken = (refreshToken) => {
    const publicKey = (0, key_generate_1.getPublicKey)();
    const payload = (0, jsonwebtoken_1.verify)(refreshToken, publicKey || "");
    const { type } = payload, userData = __rest(payload, ["type"]);
    const privateKey = (0, key_generate_1.getPrivateKey)();
    const newAccessToken = (0, jsonwebtoken_1.sign)(userData, privateKey, { algorithm: "RS256", expiresIn: "1h" });
    return { newAccessToken };
};
exports.default = {
    login,
    generateAccessToken,
    createAdmin,
    createOwner
};
