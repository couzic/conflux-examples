import { core } from "../../core";
import Select from "react-select";
import {
  CategorySelectOption,
  CitySelectOption,
} from "./ProductSearchPageState";
import { reactiveComponent } from "../../common/reactiveComponent";
import { Product, ProductId, ProductName } from "../../domain/Product";
import { FC } from "react";
import { map } from "rxjs";

const { store } = core.pages.productSearch;

const goHome = () => core.router.home.push();

const onCategorySelected = (option: CategorySelectOption | null) => {
  if (option) {
    store.dispatch({ selectCategoryOption: option });
  }
};

const onCitySelected = (option: CitySelectOption | null) => {
  if (option) {
    store.dispatch({ selectCityOption: option });
  }
};

export const ProductSearchPage = () => (
  <>
    <button onClick={goHome}>Go back home</button>
    <h1>Product Search Page</h1>
    <ProductSearchPageContent />
  </>
);

const ProductSearchPageContent = reactiveComponent(
  store.pick(
    "cityOptions",
    "selectedCityOption",
    "productCategoryOptions",
    "selectedCategoryOption"
  ),
  ({
    productCategoryOptions,
    selectedCategoryOption,
    cityOptions,
    selectedCityOption,
  }) => (
    <div>
      <div style={{ marginBottom: 20 }}>
        <Select
          placeholder="Select a category"
          options={productCategoryOptions}
          value={selectedCategoryOption}
          onChange={onCategorySelected}
        />
      </div>
      <div style={{ marginBottom: 20 }}>
        <Select
          placeholder="Select a city"
          options={cityOptions}
          value={selectedCityOption}
          onChange={onCitySelected}
        />
      </div>
      <ProductSearchResult />
    </div>
  )
);

const ProductSearchResult = reactiveComponent(
  store.pick("productSearchResultList"),
  ({ productSearchResultList }) => (
    <ProductGrid products={productSearchResultList} />
  )
);

const ProductGrid: FC<{ products: Product[] }> = ({ products }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
    {products.map((product) => (
      <ProductRow product={product} key={product.id} />
    ))}
  </div>
);

const ProductRow: FC<{ product: Product }> = ({ product }) => (
  <>
    <div>{product.name}</div>
    <div>{product.inStock ? "IN STOCK" : "NOT IN STOCK"}</div>
    <div>{product.discounted && "!!! DISCOUNTED !!!"}</div>
  </>
);
