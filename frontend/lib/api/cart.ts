import { apiClient } from './client';
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types/api';

/**
 * Get user's cart
 */
export async function getCart(): Promise<Cart> {
  const { data } = await apiClient.get<Cart>('/cart');
  return data;
}

/**
 * Add item to cart
 */
export async function addToCart(request: AddToCartRequest): Promise<Cart> {
  const { data } = await apiClient.post<Cart>('/cart/items', request);
  return data;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(itemId: number, request: UpdateCartItemRequest): Promise<Cart> {
  const { data } = await apiClient.put<Cart>(`/cart/items/${itemId}`, request);
  return data;
}

/**
 * Remove item from cart
 */
export async function removeCartItem(itemId: number): Promise<Cart> {
  const { data } = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
  return data;
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<void> {
  await apiClient.delete('/cart');
}
