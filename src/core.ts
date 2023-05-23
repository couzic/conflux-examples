import { createBrowserHistory } from "history";
import { CoreDependencies, createCore } from "./core/Core";
import { createProductService } from "./core/ProductService";
import { createRouter } from "./core/Router";
import { createCityService } from "./core/CityService";

const productionDependencies: CoreDependencies = {
  router: createRouter(createBrowserHistory()),
  cityService: createCityService(),
  productService: createProductService(),
};

export const core = createCore(productionDependencies);
