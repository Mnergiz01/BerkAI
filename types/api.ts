// API Response Types
export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string | null;
  errors: string[] | null;
}

// Auth Types
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyEmailRequest {
  email: string;
  activationCode: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  isEmailConfirmed: boolean;
  createdAt: string;
}

// Product Types
export enum Gender {
  Unisex = 0,
  Male = 1,
  Female = 2,
  Kids = 3,
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPrice?: number;
  sku: string;
  stockQuantity: number;
  gender: Gender;
  isFeatured: boolean;
  isActive: boolean;
  viewCount: number;
  categoryId: string;
  brandId: string;
  createdAt: string;
  updatedAt?: string;
  category: Category;
  brand: Brand;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  altText?: string;
  displayOrder: number;
  isMainImage: boolean;
  productId: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex?: string;
  stockQuantity: number;
  sku: string;
  priceAdjustment?: number;
  productId: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  gender: Gender;
  parentCategoryId?: string;
  subCategories?: Category[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
}

// Cart Types
export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  cartItems: CartItem[];
}

export interface CartItem {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  productVariantId?: string;
  product: Product;
  productVariant?: ProductVariant;
  createdAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  productVariantId?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Order Types
export enum OrderStatus {
  Pending = 0,
  Processing = 1,
  Shipped = 2,
  Delivered = 3,
  Cancelled = 4,
  Refunded = 5,
}

export enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
}

export enum PaymentMethod {
  CreditCard = 0,
  DebitCard = 1,
  PayPal = 2,
  Stripe = 3,
  CashOnDelivery = 4,
}

export interface Order {
  id: string;
  orderNumber: string;
  subTotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentTransactionId?: string;
  trackingNumber?: string;
  notes?: string;
  shippedAt?: string;
  deliveredAt?: string;
  userId: string;
  shippingAddressId: string;
  billingAddressId?: string;
  createdAt: string;
  shippingAddress: Address;
  billingAddress?: Address;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  productSKU?: string;
  size?: string;
  color?: string;
  orderId: string;
  productId: string;
  productVariantId?: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  userId: string;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// Search & Filter Types
export interface ProductSearchParams {
  q?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: Gender;
  sortBy?: 'price_asc' | 'price_desc' | 'name' | 'newest';
}
