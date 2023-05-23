import { Subject } from "rxjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Core } from "../../core/Core";
import { createTestCore } from "../../core/createTestCore";
import { ProductService } from "../../core/ProductService";
import { Router } from "../../core/Router";
import { Category, CategoryId, CategoryName } from "../../domain/Category";
import { Product, ProductId, ProductName } from "../../domain/Product";
import { ProductSearchPageStore } from "./ProductSearchPageStore";
import { CityService } from "../../core/CityService";
import { City } from "../../domain/City";

describe("ProductSearchPageStore", () => {
  let core: Core;
  let store: ProductSearchPageStore;
  let router: Router["productSearch"];
  let cityService: CityService;
  let receivedCities$: Subject<City[]>;
  let productService: ProductService;
  let receivedCategories$: Subject<Category[]>;
  let receivedProducts$: Subject<Product[]>;
  beforeEach(() => {
    receivedCities$ = new Subject();
    cityService = {
      fetchCities: () => receivedCities$,
    };
    receivedCategories$ = new Subject();
    receivedProducts$ = new Subject();
    productService = {
      fetchProductCategories: () => receivedCategories$,
      fetchProducts: () => receivedProducts$,
    };
    core = createTestCore({ cityService, productService });
    store = core.pages.productSearch.store;
    router = core.router.productSearch;
  });
  const cities: City[] = [{ id: "CityId", name: "CityName" }];
  const categories: Category[] = [{ id: "CategoryId", name: "CategoryName" }];
  describe("when page entered", () => {
    beforeEach(() => {
      router.push();
    });
    it("is loading", () => {
      expect(store.currentStatus).to.equal("loading");
    });
    describe("when received cities", () => {
      beforeEach(() => {
        receivedCities$.next(cities);
      });
      it("is still loading", () => {
        expect(store.currentStatus).to.equal("loading");
      });
      it("computes city options", () => {
        expect(store.currentData.cityOptions).to.have.length(1);
      });
    });
    describe("when received categories", () => {
      beforeEach(() => {
        receivedCategories$.next(categories);
      });
      it("is still loading", () => {
        expect(store.currentStatus).to.equal("loading");
      });
      it("computes category options", () => {
        expect(store.currentData.productCategoryOptions).to.have.length(1);
      });
    });
    describe("when BOTH cities and categories received", () => {
      beforeEach(() => {
        receivedCities$.next(cities);
        receivedCategories$.next(categories);
      });
      it("is loaded", () => {
        expect(store.currentStatus).to.equal("loaded");
      });
      it("has empty product search result list", () => {
        expect(store.currentData.productSearchResultList).to.be.empty;
      });
      describe("when city option selected", () => {
        beforeEach(() => {
          store.dispatch({
            selectCityOption: store.currentData.cityOptions![0],
          });
        });
        it("stores selected option", () => {
          expect(store.currentData.selectedCityOption?.value).to.equal(
            cities[0].id
          );
        });
        it("has empty product search result list", () => {
          expect(store.currentData.productSearchResultList).to.be.empty;
        });
      });
      describe("when category option selected", () => {
        beforeEach(() => {
          store.dispatch({
            selectCategoryOption: store.currentData.productCategoryOptions![0],
          });
        });
        it("stores selected option", () => {
          expect(store.currentData.selectedCategoryOption?.value).to.equal(
            categories[0].id
          );
        });
        it("has empty product search result list", () => {
          expect(store.currentData.productSearchResultList).to.be.empty;
        });
      });
      describe("when BOTH city and category options selected", () => {
        beforeEach(() => {
          store.dispatch({
            selectCityOption: store.currentData.cityOptions![0],
          });
          store.dispatch({
            selectCategoryOption: store.currentData.productCategoryOptions![0],
          });
        });
        it("is loading", () => {
          expect(store.currentStatus).to.equal("loading");
        });
        describe("when products received", () => {
          const product: Product = {
            id: "product_1" as ProductId,
            name: "Product" as ProductName,
            inStock: true,
            discounted: true,
          };
          beforeEach(() => {
            receivedProducts$.next([product]);
          });
          it("is loaded", () => {
            expect(store.currentStatus).to.equal("loaded");
          });
          it("stores product list", () => {
            expect(store.currentData.productSearchResultList).to.deep.equal([
              product,
            ]);
          });
        });
      });
    });

    // describe("when city option selected", () => {
    //   beforeEach(() => {
    //     store.dispatch({
    //       selectCityOption: store.currentData.cityOptions![0].options[0],
    //     });
    //   });
    //   it("stores selected option", () => {
    //     expect(store.currentData.selectedCityOption?.value).to.equal(
    //       "city_id_0"
    //     );
    //   });
    // });
    // describe("when category and city options are selected", () => {
    //   beforeEach(() => {
    //     let spy = vi.spyOn(productService, "fetchProducts");
    //     store.dispatch({
    //       selectCategoryOption:
    //         store.currentData.categoryOptions![0].options[0],
    //     });
    //     store.dispatch({
    //       selectCityOption: store.currentData.cityOptions![0].options[0],
    //     });
    //     expect(spy).toHaveBeenCalledOnce();
    //   });
    //   it("fetches product search result", () => {});
    //   describe("when received products", () => {
    //     const product: Product = {
    //       id: "product_1" as ProductId,
    //       name: "Product" as ProductName,
    //       inStock: true,
    //       discounted: true,
    //     };
    //     beforeEach(() => {
    //       receivedProducts$.next([product]);
    //     });
    //     it("has loaded products", () => {
    //       expect(store.currentData.productSearchResult).to.deep.equal([
    //         product,
    //       ]);
    //     });
    // it("shows product list", () => {
    //   const { products } = store.currentState;
    //   expect(products.status).to.equal("loaded");
    //   expect(products.list).to.deep.equal([product]);
    // });
    //     });
    //   });
    // });
  });
  // describe("when another city is selected", () => {
  //   let option: CitySelectOption;
  //   beforeEach(() => {
  //     option = store.currentState.citySelect.options[1]?.options[12]!;
  //     store.dispatch({ selectCityOption: option });
  //   });
  //   it("store selected option", () => {
  //     expect(store.currentState.citySelect.selectedOption).to.deep.equal(
  //       option
  //     );
  //   });
  // });
  // it("has loading category select", () => {
  //   expect(store.currentState.categorySelect.status).to.equal("loading");
  // });
  // describe("when received categories with single favorite", () => {
  //   const favoriteCategory: Category = {
  //     id: "favorite_category_id" as CategoryId,
  //     name: "Favorite Category" as CategoryName,
  //   };
  //   const otherCategory: Category = {
  //     id: "other_category_id" as CategoryId,
  //     name: "Other Category" as CategoryName,
  //   };
  //   beforeEach(() => {
  //     receivedFavoriteCategories$.next({
  //       favoriteCategories: [favoriteCategory],
  //       otherCategories: [otherCategory],
  //     });
  //   });
  //   it("shows category select with favorite selected", () => {
  //     const { categorySelect } = store.currentState;
  //     expect(categorySelect.status).to.equal("loaded");
  //     expect(categorySelect.options).to.deep.equal([
  //       {
  //         value: "favorite_categories",
  //         label: "Favorite Categories",
  //         options: [
  //           { value: favoriteCategory.id, label: favoriteCategory.name },
  //         ],
  //       },
  //       {
  //         value: "other_categories",
  //         label: "Other Categories",
  //         options: [{ value: otherCategory.id, label: otherCategory.name }],
  //       },
  //     ]);
  //     expect(categorySelect.selectedOption).to.equal(
  //       (categorySelect.options as any)[0].options[0]
  //     );
  //   });
  //   describe("when entering page AGAIN", () => {
  //     let spy: SpyInstance;
  //     beforeEach(() => {
  //       spy = vi.spyOn(userService, "fetchFavoriteCategories");
  //       core.router.productSearch.push();
  //     });
  //     it("does NOT fetch categories a second time", () => {
  //       expect(spy).not.toHaveBeenCalled();
  //     });
  //   });
  //   it("hides result table", () => {
  //     expect(store.currentState.products.status).to.equal("hidden");
  //   });
  //   describe("when received logged user", () => {
  //     beforeEach(() => {
  //       receivedLoggedUser$.next({ name: "UserName", city: cities[0].id });
  //     });
  //     it.skip("has loading product list", () => {
  //       expect(store.currentState.products.status).to.equal("loading");
  //     });
  //   });
  // });
  // describe("when received categories WITHOUT favorites", () => {
  //   const category_1: Category = {
  //     id: "category_id_1" as CategoryId,
  //     name: "Category 1" as CategoryName,
  //   };
  //   const category_2: Category = {
  //     id: "category_id_2" as CategoryId,
  //     name: "Category 2" as CategoryName,
  //   };
  //   beforeEach(() => {
  //     receivedFavoriteCategories$.next({
  //       favoriteCategories: [],
  //       otherCategories: [category_1, category_2],
  //     });
  //   });
  //   it("shows category select", () => {
  //     const { categorySelect } = store.currentState;
  //     expect(categorySelect.status).to.equal("loaded");
  //     expect(categorySelect.options).to.deep.equal([
  //       { value: category_1.id, label: category_1.name },
  //       { value: category_2.id, label: category_2.name },
  //     ]);
  //     expect(categorySelect.selectedOption).to.be.undefined;
  //   });
  //   describe("when category selected", () => {
  //     let option: CategorySelectOption;
  //     beforeEach(() => {
  //       option = store.currentState.categorySelect.options[0] as any;
  //       store.dispatch({ selectCategoryOption: option });
  //     });
  //     it.skip("does something", () => {
  //       expect(store.currentState.products.status).to.equal("loading");
  //     });
  //   });
  // });
  // describe("when received categories with MULTIPLE favorites", () => {
  //   const favoriteCategory_1: Category = {
  //     id: "favorite_category_id_1" as CategoryId,
  //     name: "Favorite Category 1" as CategoryName,
  //   };
  //   const favoriteCategory_2: Category = {
  //     id: "favorite_category_id_2" as CategoryId,
  //     name: "Favorite Category 2" as CategoryName,
  //   };
  //   const otherCategory: Category = {
  //     id: "other_category_id" as CategoryId,
  //     name: "Other Category" as CategoryName,
  //   };
  //   beforeEach(() => {
  //     receivedFavoriteCategories$.next({
  //       favoriteCategories: [favoriteCategory_1, favoriteCategory_2],
  //       otherCategories: [otherCategory],
  //     });
  //   });
  //   it("shows category select with all favorite categories option selected", () => {
  //     const { categorySelect } = store.currentState;
  //     expect(categorySelect.options).to.deep.equal([
  //       {
  //         value: "favorite_categories",
  //         label: "Favorite Categories",
  //         options: [
  //           {
  //             value: "ALL_FAVORITE_CATEGORIES",
  //             label: "All favorite categories",
  //             categoryIds: [favoriteCategory_1.id, favoriteCategory_2.id],
  //           },
  //           {
  //             value: favoriteCategory_1.id,
  //             label: favoriteCategory_1.name,
  //           },
  //           {
  //             value: favoriteCategory_2.id,
  //             label: favoriteCategory_2.name,
  //           },
  //         ],
  //       },
  //       {
  //         value: "other_categories",
  //         label: "Other Categories",
  //         options: [
  //           {
  //             value: otherCategory.id,
  //             label: otherCategory.name,
  //           },
  //         ],
  //       },
  //     ]);
  //     expect(categorySelect.selectedOption?.value).to.equal(
  //       "ALL_FAVORITE_CATEGORIES"
  //     );
  //   });
  // });
});
