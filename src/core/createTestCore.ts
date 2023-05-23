import { createMemoryHistory } from "history";
import { NEVER } from "rxjs";
import { Core, CoreDependencies, createCore } from "./Core";
import { createRouter } from "./Router";

export const createTestCore = (dependencies: Partial<CoreDependencies>): Core =>
  createCore({
    router: createRouter(createMemoryHistory()),
    cityService: dependencies.cityService || {
      fetchCities: () => NEVER,
    },
    productService: dependencies.productService || {
      fetchProducts: () => NEVER,
    },
  });
