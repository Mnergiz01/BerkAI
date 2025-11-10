import apiClient from './client';
import {
  ApiResponse,
  RegisterRequest,
  LoginRequest,
  VerifyEmailRequest,
  AuthResponse,
} from '@/types/api';

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/verify-email',
      data
    );
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );
    return response.data;
  },
};
