import apiClient from './client';
import { ApiResponse, Brand } from '@/types/api';

export const brandsApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Brand[]>>('/brands');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Brand>>(`/brands/${id}`);
    return response.data;
  },
};
