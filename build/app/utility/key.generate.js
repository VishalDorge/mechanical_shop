"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateKey = exports.getPublicKey = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getPublicKey = () => fs_1.default.readFileSync(path_1.default.resolve(__dirname, "keys", "public.pem"), { encoding: "utf8" });
exports.getPublicKey = getPublicKey;
const getPrivateKey = () => fs_1.default.readFileSync(path_1.default.resolve(__dirname, "keys", "private.pem"), { encoding: "utf8" });
exports.getPrivateKey = getPrivateKey;
