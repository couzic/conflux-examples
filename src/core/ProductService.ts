import { range } from "ramda";
import { Observable, of } from "rxjs";
import { Category, CategoryId, CategoryName } from "../domain/Category";
import { CityId } from "../domain/City";
import { Product, ProductId, ProductName } from "../domain/Product";
import { randomDelay } from "./randomDelay";

const categories = range(0, 10).map(
  (id): Category => ({
    id: `city_id_${id}` as CategoryId,
    name: `City ${id}` as CategoryName,
  })
);

export const createProductService = () => ({
  fetchProductCategories: () => of(categories).pipe(randomDelay()),
  fetchProducts: (
    categoryId: CategoryId,
    cityId: CityId
  ): Observable<Product[]> =>
    of(
      range(0, 5).map(
        (i): Product => ({
          id: `product_id_${categoryId}-${i}` as ProductId,
          name: `Product ${i} (Category ${categoryId})` as ProductName,
          inStock: Math.random() < 0.5,
          discounted: Math.random() < 0.5,
        })
      )
    ).pipe(randomDelay()),
});

export type ProductService = ReturnType<typeof createProductService>;
