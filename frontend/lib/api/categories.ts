import { apiClient } from './client';
import type { ApiResponse, Category } from '@/types/api';

export const categoriesApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },
};
