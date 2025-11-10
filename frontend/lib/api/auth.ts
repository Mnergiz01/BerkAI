import { apiClient } from './client';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/api';

/**
 * Login user
 */
export async function login(credentials: LoginRequest): Promise<any> {
  const { data } = await apiClient.post<any>('/auth/login', credentials);
  return data;
}

/**
 * Register new user
 */
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
  return data;
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me');
  return data;
}

/**
 * Verify email with activation code
 */
export async function verifyEmail(data: { email: string; activationCode: string }): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/verify-email', data);
  return response.data;
}

/**
 * Logout user (client-side only - clear local storage)
 */
export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
