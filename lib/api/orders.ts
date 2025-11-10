import apiClient from './client';
import { ApiResponse, Order, CreateOrderRequest } from '@/types/api';

export const ordersApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest) => {
    const response = await apiClient.post<ApiResponse<Order>>(
      '/orders',
      data
    );
    return response.data;
  },
};
