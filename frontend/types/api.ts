// User types
export interface User {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'Admin' | 'Customer';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  gender: 'Male' | 'Female' | 'PreferNotToSay';
}

export interface AuthResponse {
  token: string;
  user: User;
  isSuccess?: boolean;
  message?: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  categoryId: number;
  categoryName?: string;
  brandId: number;
  brandName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  items: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilters {
  searchTerm?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
}

export interface ProductSearchParams {
  q?: string;
  search?: string;
  category?: string;
  categoryId?: string;
  brand?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  page?: string;
  sortBy?: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

// Brand types
export interface Brand {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

// Cart types
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImageUrl?: string;
  quantity: number;
  cartId: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Order types
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  shippingAddress: string;
}

export interface OrdersResponse {
  items: Order[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
