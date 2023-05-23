import { CategoryId, CategoryName } from "../../domain/Category";
import { CityId, CityName } from "../../domain/City";
import { Product, ProductName } from "../../domain/Product";

export interface CategorySelectOption {
  value: CategoryId;
  label: CategoryName;
  categoryIds?: CategoryId[];
}

export interface CitySelectOption {
  value: CityId;
  label: CityName;
}

export interface ProductSearchPageState {
  selectedCategoryOption: CategorySelectOption | null;
  selectedCityOption: CitySelectOption | null;
}

export const initialProductSearchPageState: ProductSearchPageState = {
  selectedCategoryOption: null,
  selectedCityOption: null,
};
