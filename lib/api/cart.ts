import apiClient from './client';
import {
  ApiResponse,
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '@/types/api';

export const cartApi = {
  get: async () => {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data;
  },

  add: async (data: AddToCartRequest) => {
    const response = await apiClient.post<ApiResponse<Cart>>(
      '/cart/add',
      data
    );
    return response.data;
  },

  updateItem: async (cartItemId: string, data: UpdateCartItemRequest) => {
    const response = await apiClient.put<ApiResponse<Cart>>(
      `/cart/items/${cartItemId}`,
      data
    );
    return response.data;
  },

  removeItem: async (cartItemId: string) => {
    const response = await apiClient.delete<ApiResponse<Cart>>(
      `/cart/items/${cartItemId}`
    );
    return response.data;
  },

  clear: async () => {
    const response = await apiClient.delete<ApiResponse<Cart>>('/cart/clear');
    return response.data;
  },
};
