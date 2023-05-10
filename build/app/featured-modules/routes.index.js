"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_routes_1 = __importDefault(require("./user/user.routes"));
const product_routes_1 = __importDefault(require("./product/product.routes"));
const reward_routes_1 = __importDefault(require("./reward/reward.routes"));
const shop_routes_1 = __importDefault(require("./shop/shop.routes"));
const inventory_routes_1 = __importDefault(require("./inventory/inventory.routes"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const productRequest_routes_1 = __importDefault(require("./product-request/productRequest.routes"));
const rewardRequest_routes_1 = __importDefault(require("./reward-request/rewardRequest.routes"));
const sales_routes_1 = __importDefault(require("./sales/sales.routes"));
exports.default = {
    UserRouter: user_routes_1.default,
    ProductRouter: product_routes_1.default,
    RewardRouter: reward_routes_1.default,
    ShopRouter: shop_routes_1.default,
    InventoryRouter: inventory_routes_1.default,
    AuthRouter: auth_routes_1.default,
    productRequestRouter: productRequest_routes_1.default,
    rewardRequestRouter: rewardRequest_routes_1.default,
    salesRouter: sales_routes_1.default
};
