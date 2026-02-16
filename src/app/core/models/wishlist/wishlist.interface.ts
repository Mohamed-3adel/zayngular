import { Product } from '../products/product.interface';

export interface WishlistResponse {
  status: string;
  message: string;
  data: string[];
}

export interface WishlistProductsResponse {
  status: string;
  count: number;
  data: Product[];
}
