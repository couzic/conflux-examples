import { createProductSearchPageStore } from "../pages/product-search/ProductSearchPageStore";
import { CityService } from "./CityService";
import { ProductService } from "./ProductService";
import { createRootStore } from "./RootStore";
import { Router } from "./Router";

export interface CoreDependencies {
  router: Router;
  cityService: CityService;
  productService: ProductService;
}

export const createCore = (dependencies: CoreDependencies) => {
  const rootStore = createRootStore();
  const productSearchStore = createProductSearchPageStore(
    rootStore,
    dependencies
  );
  const core = {
    router: dependencies.router,
    rootStore,
    pages: {
      productSearch: {
        store: productSearchStore,
      },
    },
  };
  rootStore.activate();
  return core;
};

export type Core = ReturnType<typeof createCore>;
