import { History } from "history";
import { createBrowserRouter, route } from "observable-tree-router";

export const createRouter = (history: History) =>
  createBrowserRouter(history, {
    home: route({ path: "/" }),
    examples: route({
      path: "/examples",
      nested: {
        "1": route({
          path: "/1",
          nested: {
            a: route({ path: "/a" }),
            b: route({ path: "/b" }),
            c: route({ path: "/c/:pokemon-name", params: ["pokemon-name"] }),
          },
        }),
        "2": route({
          path: "/2/:pokemon-name",
          params: ["pokemon-name"],
        }),
        "3": route({ path: "/3" }),
        "4": route({
          path: "/4",
          nested: {
            a: route({ path: "/a" }),
            b: route({ path: "/b/:pokemon-name", params: ["pokemon-name"] }),
          },
        }),
      },
    }),
    productSearch: route({
      path: "/product-search",
    }),
  });

export type Router = ReturnType<typeof createRouter>;
