"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludedPaths = exports.routes = void 0;
const routes_types_1 = require("./routes.types");
const token_validate_1 = require("../utility/middleware/token.validate");
const routes_index_1 = __importDefault(require("../featured-modules/routes.index"));
exports.routes = [
    new routes_types_1.Route("/auth", routes_index_1.default.AuthRouter),
    new routes_types_1.Route("/user", routes_index_1.default.UserRouter),
    new routes_types_1.Route("/shop", routes_index_1.default.ShopRouter),
    new routes_types_1.Route("/product", routes_index_1.default.ProductRouter),
    new routes_types_1.Route("/reward", routes_index_1.default.RewardRouter),
    new routes_types_1.Route("/inventory", routes_index_1.default.InventoryRouter),
    new routes_types_1.Route("/product-request", routes_index_1.default.productRequestRouter),
    new routes_types_1.Route("/reward-request", routes_index_1.default.rewardRequestRouter),
    new routes_types_1.Route("/sales", routes_index_1.default.salesRouter)
];
exports.excludedPaths = [
    new token_validate_1.ExcludedPath("/auth/login", "POST"),
    new token_validate_1.ExcludedPath("/shop", "GET"),
    new token_validate_1.ExcludedPath("/shop/rating", "POST"),
    new token_validate_1.ExcludedPath("/auth/token", "POST")
];
