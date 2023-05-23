import { createFocusableStore, createStore, silentLoggerOptions } from "lenrix";
import {
  ProductSearchPageState,
  initialProductSearchPageState,
} from "../pages/product-search/ProductSearchPageState";

export interface RootState {
  loggedIn: boolean;
  products: ProductSearchPageState;
}

export const initialRootState: RootState = {
  loggedIn: false,
  products: initialProductSearchPageState,
};

const w = "window" in globalThis ? (window as any) : null;

// console.log(pick(["MODE", "DEV", "PROD", "NODE_ENV", "TEST"], import.meta.env));

const createStoreInstance = () =>
  import.meta.env.TEST
    ? createStore(initialRootState, { logger: silentLoggerOptions })
    : import.meta.env.DEV
    ? createFocusableStore(
        (state) => state || initialRootState,
        initialRootState,
        w?.__REDUX_DEVTOOLS_EXTENSION__ && w?.__REDUX_DEVTOOLS_EXTENSION__()
      )
    : createStore(initialRootState, {
        logger: {
          ...silentLoggerOptions,
          console: { ...silentLoggerOptions.console, error: true },
        },
      });

export const createRootStore = () => createStoreInstance();

export type RootStore = ReturnType<typeof createRootStore>;
