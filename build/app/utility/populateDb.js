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
exports.populate = void 0;
const auth_services_1 = __importDefault(require("../featured-modules/auth/auth.services"));
const role_services_1 = __importDefault(require("../featured-modules/role/role.services"));
const status_services_1 = __importDefault(require("../featured-modules/status/status.services"));
const constant_1 = require("./constant");
const populate = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield auth_services_1.default.createAdmin(constant_1.adminData);
        constant_1.statusesData.forEach((status) => __awaiter(void 0, void 0, void 0, function* () { return yield status_services_1.default.add(status); }));
        constant_1.rolesData.forEach((role) => __awaiter(void 0, void 0, void 0, function* () { return yield role_services_1.default.add(role); }));
    }
    catch (error) {
        console.log("Data is Already Populated...");
    }
});
exports.populate = populate;
