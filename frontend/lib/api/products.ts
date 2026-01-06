import { apiClient } from './client';
import type { ApiResponse, Product, ProductSearchParams } from '@/types/api';

export const productsApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  getSpecialCollectionById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Product>>(`/SpecialCollection/${id}`);
    return response.data;
  },

  search: async (params: ProductSearchParams) => {
    const response = await apiClient.get<ApiResponse<Product[]>>('/products/search', { params });
    return response.data;
  },
};
