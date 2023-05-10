import UserRouter from "./user/user.routes";
import ProductRouter from "./product/product.routes";
import RewardRouter from "./reward/reward.routes";
import ShopRouter from "./shop/shop.routes";
import InventoryRouter from "./inventory/inventory.routes";
import AuthRouter from "./auth/auth.routes"
import productRequestRouter from "./product-request/productRequest.routes";
import rewardRequestRouter from "./reward-request/rewardRequest.routes";
import salesRouter from "./sales/sales.routes";

export default {
    UserRouter,
    ProductRouter,
    RewardRouter,
    ShopRouter,
    InventoryRouter,
    AuthRouter,
    productRequestRouter,
    rewardRequestRouter,
    salesRouter
}