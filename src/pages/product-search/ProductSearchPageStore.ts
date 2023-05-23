import { filter, map, of } from "rxjs";
import { CoreDependencies } from "../../core/Core";
import { Category } from "../../domain/Category";
import { City } from "../../domain/City";
import {
  CategorySelectOption,
  CitySelectOption,
} from "./ProductSearchPageState";
import { RootStore } from "../../core/RootStore";

export const createProductSearchPageStore = (
  rootStore: RootStore,
  { router, cityService, productService }: CoreDependencies
) =>
  rootStore
    .focusPath("products")
    .actionTypes<{
      selectCategoryOption: CategorySelectOption;
      selectCityOption: CitySelectOption;
    }>()
    .updates((_) => ({
      selectCategoryOption: _.focusPath("selectedCategoryOption").setValue(),
      selectCityOption: _.focusPath("selectedCityOption").setValue(),
    }))
    .loadFromStream(router.productSearch.match$.pipe(filter(Boolean)), {
      cityOptions: () =>
        cityService
          .fetchCities()
          .pipe(map((cities) => cities.map(cityToSelectOption))),
      productCategoryOptions: () =>
        productService
          .fetchProductCategories()
          .pipe(map((categories) => categories.map(categoryToSelectOption))),
    })
    .loadFromFields(["selectedCityOption", "selectedCategoryOption"], {
      productSearchResultList: ({
        selectedCityOption,
        selectedCategoryOption,
      }) => {
        if (!selectedCityOption || !selectedCategoryOption) return of([]);
        return productService.fetchProducts(
          selectedCategoryOption.value,
          selectedCityOption.value
        );
      },
    })
    // .loadFromFields(["selectedCategoryOption", "selectedCityOption"], {
    //   productSearchResult: ({ selectedCategoryOption, selectedCityOption }) =>
    //     selectedCategoryOption === null || selectedCityOption === null
    //       ? of([])
    //       : productService.fetchProducts(
    //           selectedCategoryOption!.value,
    //           selectedCityOption!.value
    //         ),
    // })
    .epics(() => ({
      // productsPageEntered: pipe(
      //   first(),
      //   map(() => ({ fetchCategories: {} }))
      // ),
      // fetchCategories: pipe(
      //   switchMap(() => userService.fetchFavoriteCategories()),
      //   map((categories) => ({ receivedCategories: categories }))
      // ),
    }))
    .updates((_) => ({
      // receivedCategories: ({ favoriteCategories, otherCategories }) =>
      //   _.focusPath("categorySelect").setFields({
      //     status: "loaded",
      //     options:
      //       favoriteCategories.length === 0
      //         ? otherCategories.map(categoryToSelectOption)
      //         : [
      //             {
      //               value: "favorite_categories",
      //               label: "Favorite Categories",
      //               options:
      //                 favoriteCategories.length === 1
      //                   ? favoriteCategories.map(categoryToSelectOption)
      //                   : [
      //                       {
      //                         value: "ALL_FAVORITE_CATEGORIES" as CategoryId,
      //                         label: "All favorite categories" as CategoryName,
      //                         categoryIds: favoriteCategories.map((_) => _.id),
      //                       },
      //                       ...favoriteCategories.map(categoryToSelectOption),
      //                     ],
      //             },
      //             {
      //               value: "other_categories",
      //               label: "Other Categories",
      //               options: otherCategories.map(categoryToSelectOption),
      //             },
      //           ],
      //   }),
    }))
    .epics((store) => ({
      // receivedCategories: pipe(
      //   map(() => store.currentState.categorySelect.options[0]),
      //   map((option) => ("options" in option ? option.options : null)),
      //   filter(Boolean),
      //   map((options) => options[0]),
      //   map((option) => ({ selectCategoryOption: option }))
      // ),
    }))

    .updates((_) => ({
      // setCityOptions: (options) =>
      //   _.focusPath("citySelect").setFields({
      //     status: "loaded",
      //     options,
      //     selectedOption: options[0]?.options[0],
      //   }),
      // selectCityOption: _.focusPath("citySelect", "selectedOption").setValue(),
    }))
    .epics((store) => ({
      // selectCategoryOption: map(() => ({ maybeFetchProducts: {} })),
      // // selectCityOption: map(() => ({ maybeFetchProducts: {} })),
      // maybeFetchProducts: pipe(
      //   map(() => store.currentState),
      //   map(
      //     ({ categorySelect, citySelect }) =>
      //       [categorySelect.selectedOption, citySelect.selectedOption] as const
      //   ),
      //   filter(
      //     ([categoryOption, cityOption]) =>
      //       categoryOption !== undefined && cityOption !== undefined
      //   ),
      //   map(([categoryOption, cityOption]) => ({
      //     fetchProducts: {
      //       categoryIds: categoryOption!.categoryIds || [categoryOption!.value],
      //       cityId: cityOption!.value,
      //     },
      //   }))
      // ),
      // fetchProducts: pipe(
      //   switchMap(({ categoryIds, cityId }) =>
      //     productService.fetchProducts(categoryIds, cityId)
      //   ),
      //   map((result) => ({ receivedProducts: result }))
      // ),
    }))
    .updates((_) => ({
      // fetchProducts: () =>
      //   _.focusPath("products").setFields({ status: "loading" }),
      // receivedProducts: (products) =>
      //   _.focusPath("products").setFields({
      //     status: "loaded",
      //     list: asSequence(products)
      //       .map((_) => _.products)
      //       .flatten()
      //       .toArray(),
      //   }),
    }));

const categoryToSelectOption = ({
  id,
  name,
}: Category): CategorySelectOption => ({
  value: id,
  label: name,
});

const cityToSelectOption = ({ id, name }: City): CitySelectOption => ({
  value: id,
  label: name,
});

export type ProductSearchPageStore = ReturnType<
  typeof createProductSearchPageStore
>;
