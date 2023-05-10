import { Route } from "./routes.types";
import { ExcludedPath } from "../utility/middleware/token.validate";
import Routers from "../featured-modules/routes.index";

export const routes: Route[] = [
    new Route("/auth", Routers.AuthRouter),
    new Route("/user", Routers.UserRouter),
    new Route("/shop", Routers.ShopRouter),
    new Route("/product", Routers.ProductRouter),
    new Route("/reward", Routers.RewardRouter),
    new Route("/inventory", Routers.InventoryRouter),
    new Route("/product-request", Routers.productRequestRouter),
    new Route("/reward-request", Routers.rewardRequestRouter),
    new Route("/sales", Routers.salesRouter)
]

export const excludedPaths: ExcludedPath[] = [
    new ExcludedPath("/auth/login", "POST"),
    new ExcludedPath("/shop", "GET"),
    new ExcludedPath("/shop/rating", "POST"),
    new ExcludedPath("/auth/token", "POST")
]