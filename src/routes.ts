import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { ProductDetail } from "./pages/ProductDetail";
import { TopProducts } from "./pages/TopProducts";
import { Trending } from "./pages/Trending";
import { Categories } from "./pages/Categories";
import { SavedDeals } from "./pages/SavedDeals";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard
  },
  {
    path: "/product/:productId",
    Component: ProductDetail
  },
  {
    path: "/top-products",
    Component: TopProducts
  },
  {
    path: "/trending",
    Component: Trending
  },
  {
    path: "/categories",
    Component: Categories
  },
  {
    path: "/saved",
    Component: SavedDeals
  }
]);