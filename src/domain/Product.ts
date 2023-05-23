export type ProductId = "ProductId";
export type ProductName = "ProductName";

export interface Product {
  id: ProductId;
  name: ProductName;
  inStock: boolean;
  discounted: boolean;
}
