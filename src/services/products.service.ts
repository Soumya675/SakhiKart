import { APP_CONFIG } from '@/src/lib/api/config';
import { productRepository } from '@/src/lib/api/product.repository';
import { ApiResponse } from '@/src/types/common';
import {
  Product,
  ProductCategory,
  ProductFilterParams,
  ProductStatus,
  ProductSubmissionInput,
} from '@/src/types/product';

function wrap<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    source: APP_CONFIG.dataMode,
    timestamp: new Date().toISOString(),
    message,
  };
}

export const ProductsService = {
  async getCategories(): Promise<ApiResponse<ProductCategory[]>> {
    const categories = await productRepository.getCategories();
    return wrap(categories);
  },

  async listProducts(filters?: ProductFilterParams): Promise<ApiResponse<Product[]>> {
    const items = await productRepository.listProducts(filters);
    return wrap(items);
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<Product | null>> {
    const item = await productRepository.getProductBySlug(slug);
    return wrap(item);
  },

  async getProductsBySeller(sellerId: string): Promise<ApiResponse<Product[]>> {
    const items = await productRepository.getProductsBySeller(sellerId);
    return wrap(items);
  },

  async submitProduct(input: ProductSubmissionInput): Promise<ApiResponse<Product>> {
    const created = await productRepository.submitProduct(input);
    return wrap(created, 'Product submitted for SakhiKart quality verification');
  },

  async updateProductStatus(
    productId: string,
    status: ProductStatus
  ): Promise<ApiResponse<Product>> {
    const updated = await productRepository.updateProductStatus(productId, status);
    return wrap(updated, `Product status updated to ${status}`);
  },
};
